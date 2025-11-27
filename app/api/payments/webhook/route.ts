import { NextResponse } from "next/server";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || "TEST-4835802996924816-112316-5b0c9027878652395376043147814781-186968036"
});

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const topic = url.searchParams.get("topic") || url.searchParams.get("type");
        const id = url.searchParams.get("id") || url.searchParams.get("data.id");

        if (topic === "payment" && id) {
            const payment = new Payment(client);
            const paymentData = await payment.get({ id });

            if (paymentData.status === "approved") {
                const externalRef = paymentData.external_reference;

                if (externalRef) {
                    const [userId, minutesStr] = externalRef.split(":");
                    const minutes = parseInt(minutesStr);

                    if (userId && !isNaN(minutes)) {
                        // Check if this payment was already processed to avoid duplicates
                        // Ideally we should have a Payment model, but for now we trust the webhook logic
                        // or we could check if the last update was recent.
                        // For MVP, we just increment.

                        await prisma.user.update({
                            where: { id: userId },
                            data: {
                                minutes: {
                                    increment: minutes
                                }
                            }
                        });

                        console.log(`Credited ${minutes} minutes to user ${userId}`);
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
