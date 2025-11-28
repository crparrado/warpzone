import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processPurchaseRewards } from "@/lib/rewards";

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const { id, event_type, entity_id } = payload;

        console.log("One.lat webhook received:", payload);

        // We only process PAYMENT_ORDER.CLOSED events (successful payments)
        if (event_type !== "PAYMENT_ORDER.CLOSED") {
            return NextResponse.json({ received: true });
        }

        const apiKey = process.env.ONE_API_KEY;
        const apiSecret = process.env.ONE_API_SECRET;

        if (!apiKey || !apiSecret) {
            console.error("One.lat credentials missing");
            return NextResponse.json({ error: "Configuration error" }, { status: 500 });
        }

        // Verify payment status with One.lat API
        const response = await fetch(`https://api.one.lat/v1/payment_orders/${entity_id}`, {
            headers: {
                "x-api-key": apiKey,
                "x-api-secret": apiSecret
            }
        });

        if (!response.ok) {
            console.error("Error fetching payment order:", await response.text());
            return NextResponse.json({ error: "Error fetching payment details" }, { status: 500 });
        }

        const paymentOrder = await response.json();

        if (paymentOrder.status !== "CLOSED") {
            console.log("Payment order not closed:", paymentOrder.status);
            return NextResponse.json({ received: true });
        }

        const purchaseId = paymentOrder.external_id;

        // Find the purchase to get userId and productId
        const purchase = await prisma.purchase.findUnique({
            where: { id: purchaseId }
        });

        if (!purchase) {
            console.error("Purchase not found for ID:", purchaseId);
            return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
        }

        // Process rewards (idempotent)
        const result = await processPurchaseRewards(purchase.userId, purchase.productId, purchaseId);

        if (result.alreadyCompleted) {
            console.log("Purchase already processed:", purchaseId);
        } else {
            console.log("Purchase processed successfully:", purchaseId);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json({ error: "Webhook error" }, { status: 500 });
    }
}
