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
                    const minutes = parseInt(parts[1]);
                    const productId = parts[2];

                    if (userId && !isNaN(minutes)) {
                        // 0. Idempotency Check
                        // Check if this payment ID was already processed
                        const existingPurchase = await prisma.purchase.findUnique({
                            where: { paymentId: id?.toString() }
                        });

                        if (existingPurchase) {
                            console.log(`Payment ${id} already processed. Skipping.`);
                            return NextResponse.json({ status: "ok", message: "Already processed" });
                        }

                        // 1. Update User Minutes
                        const user = await prisma.user.update({
                            where: { id: userId },
                            data: {
                                minutes: { increment: minutes },
                                totalHoursPurchased: { increment: minutes / 60 }
                            }
                        });

                        console.log(`Credited ${minutes} minutes to user ${userId}`);

                        // 2. Create Purchase Record (if productId exists)
                        let purchaseId = "MP-" + id;
                        let productName = "Carga de Créditos";
                        let amount = Math.round(paymentData.transaction_amount || 0);

                        if (productId && productId !== 'unknown') {
                            try {
                                const product = await prisma.product.findUnique({ where: { id: productId } });
                                if (product) {
                                    productName = product.name;
                                    const purchase = await prisma.purchase.create({
                                        data: {
                                            userId,
                                            productId,
                                            amount,
                                            status: "COMPLETED",
                                            paymentId: id?.toString()
                                        }
                                    });
                                    purchaseId = purchase.id;
                                }
                            } catch (e) {
                                console.error("Error creating purchase record:", e);
                            }
                        }

                        // 3. Send Confirmation Email
                        // We need to import sendPurchaseConfirmationEmail dynamically or at top level
                        // Since we are inside the function, let's assume it's imported at top.
                        // I will add the import in a separate step if needed, but I'll try to add it here if I can edit the whole file or top.
                        // For now, let's assume I'll add the import.

                        // We need to import the email function. 
                        // Since I can't easily add imports with this tool without replacing the whole file or top, 
                        // I'll assume I will add the import in the next step.

                        // Wait, I can't call the function if it's not imported.
                        // I will add the logic here and then add the import.

                        const { sendPurchaseConfirmationEmail } = await import("@/lib/email");
                        await sendPurchaseConfirmationEmail(
                            user.email,
                            user.name || "Gamer",
                            productName,
                            amount,
                            minutes,
                            purchaseId
                        );
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
