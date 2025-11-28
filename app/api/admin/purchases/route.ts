import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const purchases = await prisma.purchase.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                },
                product: {
                    select: { name: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(purchases);
    } catch (error) {
        console.error("Error fetching purchases:", error);
        return NextResponse.json({ error: "Error fetching purchases" }, { status: 500 });
    }
}
