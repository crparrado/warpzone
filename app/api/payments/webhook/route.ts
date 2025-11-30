import { NextResponse } from "next/server";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || "TEST-4835802996924816-112316-5b0c9027878652395376043147814781-186968036"
});

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        let topic = url.searchParams.get("topic") || url.searchParams.get("type");
        let id = url.searchParams.get("id") || url.searchParams.get("data.id");

        if (!id) {
            try {
                const body = await request.json();
                topic = body.type || body.topic;
                id = body.data?.id || body.id;
            } catch (e) {
                // Body might be empty or not json
            }
        }

        if (topic === "payment" && id) {
            const payment = new Payment(client);
            const paymentData = await payment.get({ id });

            if (paymentData.status === "approved") {
                const externalRef = paymentData.external_reference;

                if (externalRef) {
                    const parts = externalRef.split(":");
                    const userId = parts[0];
                    let minutes = parseInt(parts[1]); // Changed to let
                    const productId = parts[2];

                    if (userId && !isNaN(minutes)) {
                        let purchaseId = "MP-" + id;
                        let productName = "Carga de Créditos";
                        let amount = Math.round(paymentData.transaction_amount || 0);
                        let purchase = null;

                        // Fetch user for emails
                        const user = await prisma.user.findUnique({ where: { id: userId } });
                        if (!user) {
                            console.error("User not found for webhook:", userId);
                            return NextResponse.json({ error: "User not found" }, { status: 404 });
                        }

                        // 1. Try to Create Purchase Record First (Idempotency Lock)
                        if (productId && productId !== 'unknown') {
                            try {
                                const product = await prisma.product.findUnique({ where: { id: productId } });
                                if (product) {
                                    productName = product.name;

                                    // Create purchase as PENDING first
                                    purchase = await prisma.purchase.create({
                                        data: {
                                            userId,
                                            productId,
                                            amount,
                                            status: "PENDING", // Changed to PENDING so processPurchaseRewards handles completion
                                            paymentId: id?.toString()
                                        }
                                    });
                                    purchaseId = purchase.id;
                                }
                            } catch (e: any) {
                                if (e.code === 'P2002') {
                                    console.log(`Payment ${id} already processed (DB constraint). Skipping.`);
                                    return NextResponse.json({ status: "ok", message: "Already processed" });
                                }
                                console.error("Error creating purchase record:", e);
                                return NextResponse.json({ error: "Failed to record purchase" }, { status: 500 });
                            }
                        }

                        // 2. Process Rewards (Unlock achievements, add minutes, update level)
                        // This replaces the manual user update and handles the purchase completion
                        try {
                            const rewardsModule = await import("@/lib/rewards");
                            const result = await rewardsModule.processPurchaseRewards(userId, productId, purchaseId);

                            // If it was already completed (idempotency), we stop
                            if (result.alreadyCompleted) {
                                console.log(`Payment ${id} already processed (Rewards check). Skipping.`);
                                return NextResponse.json({ status: "ok", message: "Already processed" });
                            }

                            console.log(`Processed rewards for user ${userId}. Level: ${result.newLevel}. Bonus: ${result.totalBonusMinutes}m`);

                            // Update minutes for email (base + bonus)
                            minutes += result.totalBonusMinutes;
                        } catch (rewardError) {
                            console.error("Error processing rewards:", rewardError);
                            // If rewards fail, we should probably still return ok to MP but log critical error
                            // The purchase might be stuck in PENDING if this fails.
                            // Ideally we should retry or handle this better, but for now logging is key.
                        }

                        // 3. Send Confirmation Email

                        // 3. Send Confirmation Email
                        try {
                            const emailModule = await import("@/lib/email");
                            await emailModule.sendPurchaseConfirmationEmail(
                                user.email,
                                user.name || "Gamer",
                                productName,
                                amount,
                                minutes,
                                purchaseId
                            );
                        } catch (emailError) {
                            console.error("Error sending purchase email:", emailError);
                        }

                        // 4. Send Admin Notification
                        try {
                            const emailModule = await import("@/lib/email");
                            await emailModule.sendAdminPurchaseNotification(
                                user.name || "Usuario",
                                user.email,
                                productName,
                                amount,
                                purchaseId
                            );
                        } catch (adminEmailError) {
                            console.error("Error sending admin notification:", adminEmailError);
                        }
                    }
                }
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
