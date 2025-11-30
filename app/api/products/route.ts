import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
    }
}

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

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, price } = body;

        const product = await prisma.product.update({
            where: { id },
            data: { price: Number(price) }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Error updating product" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        // 1. Find the product to delete
        const productToDelete = await prisma.product.findUnique({ where: { id } });
        if (!productToDelete) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // 2. Find a replacement product
        // First try exact name match
        let replacementProduct = await prisma.product.findFirst({
            where: {
                name: productToDelete.name,
                id: { not: id }
            },
            orderBy: { createdAt: 'asc' }
        });

        // If no name match, try matching by minutes and price (handling "1 HORA" vs "Ficha 1 Hora" case)
        if (!replacementProduct) {
            replacementProduct = await prisma.product.findFirst({
                where: {
                    minutes: productToDelete.minutes,
                    price: productToDelete.price,
                    id: { not: id }
                },
                orderBy: { createdAt: 'asc' }
            });
        }

        if (replacementProduct) {
            // 3. Reassign purchases to the replacement product
            const updateResult = await prisma.purchase.updateMany({
                where: { productId: id },
                data: { productId: replacementProduct.id }
            });
            console.log(`Reassigned ${updateResult.count} purchases from ${id} to ${replacementProduct.id}`);
        } else {
            // If no replacement found, check if there are purchases.
            const purchaseCount = await prisma.purchase.count({ where: { productId: id } });
            if (purchaseCount > 0) {
                // Last resort: Find ANY product with the same minutes? 
                // Or just fail. Failing is safer, but user is stuck.
                // Let's return a more descriptive error.
                return NextResponse.json({
                    error: "No se puede eliminar: Tiene compras asociadas y no se encontró otro producto equivalente (mismo nombre o mismo precio/duración) para transferirlas."
                }, { status: 400 });
            }
        }

        // 4. Delete the product
        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Error deleting product" }, { status: 500 });
    }
}
