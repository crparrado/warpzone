import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

const DEFAULT_PRODUCTS = [
    {
        name: "Ficha 1 Hora",
        price: 2000,
        type: "Ficha",
        minutes: 60,
        description: "Acceso por 1 hora a cualquier PC.",
        popular: false
    },
    {
        name: "Ficha 3 Horas",
        price: 5000,
        type: "Ficha",
        minutes: 180,
        description: "Ahorra y juega más tiempo.",
        popular: true
    },
    {
        name: "Ficha 5 Horas",
        price: 8000,
        type: "Ficha",
        minutes: 300,
        description: "Para sesiones intensivas.",
        popular: false
    },
    {
        name: "Day Pass",
        price: 15000,
        type: "Pase",
        minutes: 720, // 12 hours
        description: "Acceso ilimitado por un día (10:00 - 22:00).",
        popular: false
    },
    {
        name: "Night Pass (Coruja)",
        price: 12000,
        type: "Pase",
        minutes: 480, // 8 hours
        description: "Acceso nocturno exclusivo (22:00 - 06:00).",
        popular: false
    },
];

export async function GET() {
    try {
        let products = await prisma.product.findMany({
            orderBy: { price: 'asc' }
        });

        if (products.length === 0) {
            console.log("Seeding default products...");
            await prisma.product.createMany({
                data: DEFAULT_PRODUCTS
            });
            products = await prisma.product.findMany({
                orderBy: { price: 'asc' }
            });
        }

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, price } = body;

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: { price: parseInt(price) },
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json({ error: "Error updating product" }, { status: 500 });
    }
}
