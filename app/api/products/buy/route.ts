import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { userId, productId } = await req.json();

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // 1. Create Purchase Record
        const purchase = await prisma.purchase.create({
            data: {
                userId,
                productId,
                amount: product.price,
            },
        });

        // 2. Add Minutes to User
        await prisma.user.update({
            where: { id: userId },
            data: {
                minutes: {
                    increment: product.minutes,
                },
            },
        });

        return NextResponse.json(purchase);
    } catch (error) {
        console.error("Error processing purchase:", error);
        return NextResponse.json({ error: "Error processing purchase" }, { status: 500 });
    }
}
