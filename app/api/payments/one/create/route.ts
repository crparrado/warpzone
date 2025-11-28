import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { productId, userId } = await req.json();

        if (!productId || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create a pending purchase record to track this transaction
        // We'll update it to completed when the webhook hits or success redirect happens
        // For now, we just need the ID to pass as external_id
        const purchase = await prisma.purchase.create({
            data: {
                userId,
                productId,
                amount: product.price,
                status: "PENDING",
            }
        });

        const apiKey = process.env.ONE_API_KEY;
        const apiSecret = process.env.ONE_API_SECRET;

        if (!apiKey || !apiSecret) {
            console.error("One.lat credentials missing");
            return NextResponse.json({ error: "Payment configuration error" }, { status: 500 });
        }

        const payload = {
            amount: product.price,
            currency: "CLP",
            origin: "API",
            external_id: purchase.id,
            title: `Warpzone: ${product.name}`,
            type: "PAYMENT",
            custom_urls: {
                // TODO: Update these URLs for production
                success_payment_redirect: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=success`,
                error_payment_redirect: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/fichas-y-pases?payment=error`
            },
            payer: {
                email: user.email,
                name: user.name || "Gamer",
            }
        };

        const response = await fetch("https://api.one.lat/v1/checkout_preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "x-api-secret": apiSecret
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("One.lat error:", errorData);
            return NextResponse.json({ error: "Error creating payment preference" }, { status: 500 });
        }

        const data = await response.json();
        return NextResponse.json({ checkoutUrl: data.checkout_url });

    } catch (error) {
        console.error("Error processing One.lat payment:", error);
        return NextResponse.json({ error: "Error processing payment" }, { status: 500 });
    }
}
