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
                success_payment_redirect: `${process.env.NEXT_PUBLIC_APP_URL || 'https://warpzone.cl'}/dashboard?payment=success`,
                error_payment_redirect: `${process.env.NEXT_PUBLIC_APP_URL || 'https://warpzone.cl'}/fichas-y-pases?payment=error`,
                status_changes_webhook: `${process.env.NEXT_PUBLIC_APP_URL || 'https://warpzone.cl'}/api/payments/one/webhook`
            },
            payer: {
                email: user.email,
                name: user.name || "Gamer",
            }
        };

        console.log("One.lat request payload:", JSON.stringify(payload, null, 2));

        const response = await fetch("https://api.one.lat/v1/checkout_preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "x-api-secret": apiSecret,
                "User-Agent": "Warpzone/1.0"
            },
            body: JSON.stringify(payload)
        });

        console.log("One.lat response status:", response.status);
        console.log("One.lat response headers:", Object.fromEntries(response.headers.entries()));

        const responseText = await response.text();
        console.log("One.lat response body:", responseText.substring(0, 500));

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                errorData = { message: responseText };
            }
            console.error("One.lat error:", errorData);
            return NextResponse.json({
                error: "Error creating payment preference",
                details: errorData
            }, { status: 500 });
        }

        const data = JSON.parse(responseText);
        return NextResponse.json({ checkoutUrl: data.checkout_url });

    } catch (error) {
        console.error("Error processing One.lat payment:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json({
            error: "Error processing payment",
            message: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
