import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, price, minutes, type, description, popular } = body;

        if (!name || !price || !minutes || !type || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                price: Number(price),
                minutes: Number(minutes),
                type,
                description,
                popular: Boolean(popular)
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Error creating product" }, { status: 500 });
    }
}
