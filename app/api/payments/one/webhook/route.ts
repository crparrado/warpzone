import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPurchaseConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("One.lat Webhook received:", body);

        // Handle the event-based webhook structure
        // Payload example: { event_type: 'PAYMENT_ORDER.CLOSED', payment_order_id: '...' }

        let purchaseId = body.external_id;
        let paymentStatus = body.status;

        // If it's an event, we need to fetch the order details
        if (body.event_type === "PAYMENT_ORDER.CLOSED" || body.payment_order_id) {
            const paymentOrderId = body.payment_order_id || body.entity_id;

            if (paymentOrderId) {
                console.log(`Fetching details for order ${paymentOrderId}...`);
                const apiKey = process.env.ONE_API_KEY;
                const apiSecret = process.env.ONE_API_SECRET;

                const orderRes = await fetch(`https://api.one.lat/v1/payment_orders/${paymentOrderId}`, {
                    headers: {
                        "x-api-key": apiKey!,
                        "x-api-secret": apiSecret!
                    }
                });

                if (orderRes.ok) {
                    const orderData = await orderRes.json();
                    console.log("Order details fetched:", JSON.stringify(orderData, null, 2));

                    purchaseId = orderData.external_id;
                    paymentStatus = orderData.status; // e.g. 'PAID', 'CLOSED'
                } else {
                    console.error("Failed to fetch order details from One.lat");
                }
            }
        }

        if (paymentStatus === "PAID" || paymentStatus === "COMPLETED" || paymentStatus === "CLOSED") { // 'CLOSED' often means paid in One.lat
            if (!purchaseId) {
                console.error("No purchase ID found in webhook data");
                return NextResponse.json({ error: "No external_id found" }, { status: 400 });
            }

            const purchase = await prisma.purchase.findUnique({
                where: { id: purchaseId },
                include: { user: true, product: true }
            });

            if (!purchase) {
                console.error(`Purchase not found for external_id: ${purchaseId}`);
                return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
            }

            if (purchase.status === "COMPLETED") {
                console.log(`Purchase ${external_id} already completed.`);
                return NextResponse.json({ message: "Already processed" });
            }

            // Update purchase and user credits transactionally
            await prisma.$transaction(async (tx) => {
                // 1. Mark purchase as completed
                await tx.purchase.update({
                    where: { id: purchase.id },
                    data: { status: "COMPLETED" }
                });

                // 2. Add credits to user
                await tx.user.update({
                    where: { id: purchase.userId },
                    data: {
                        minutes: { increment: purchase.product.minutes },
                        totalHoursPurchased: { increment: Math.floor(purchase.product.minutes / 60) }
                    }
                });
            });

            console.log(`Credits added for user ${purchase.user.email}`);

            // 3. Send Confirmation Email
            await sendPurchaseConfirmationEmail(
                purchase.user.email,
                purchase.user.name || "Gamer",
                purchase.product.name,
                purchase.amount,
                purchase.product.minutes,
                purchase.id
            );

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ message: "Status ignored" });

    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
