import { NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";

// Initialize client with access token
// In production, this should be in env vars
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || "TEST-4835802996924816-112316-5b0c9027878652395376043147814781-186968036"
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, quantity, price, userId, minutes } = body;

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: "credits",
                        title: title,
                        quantity: quantity,
                        unit_price: Number(price),
                        currency_id: "CLP",
                    },
                ],
                // We store userId, minutes, and productId in external_reference
                external_reference: `${userId}:${minutes}:${body.productId || 'unknown'}`,
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_URL || "https://warpzone.cl"}/dashboard?status=success`,
                    failure: `${process.env.NEXT_PUBLIC_URL || "https://warpzone.cl"}/fichas-y-pases?status=failure`,
                    pending: `${process.env.NEXT_PUBLIC_URL || "https://warpzone.cl"}/fichas-y-pases?status=pending`,
                },
                auto_return: "approved",
            },
        });

        return NextResponse.json({ id: result.id, init_point: result.init_point });
    } catch (error) {
        console.error("Error creating preference:", error);
        return NextResponse.json(
            { error: "Error creating payment preference" },
            { status: 500 }
        );
    }
}
