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

        // 2. Find a replacement product (same name, different ID)
        // This is crucial for merging duplicates
        const replacementProduct = await prisma.product.findFirst({
            where: {
                name: productToDelete.name,
                id: { not: id }
            },
            orderBy: { createdAt: 'asc' }
        });

        if (replacementProduct) {
            // 3. Reassign purchases to the replacement product
            const updateResult = await prisma.purchase.updateMany({
                where: { productId: id },
                data: { productId: replacementProduct.id }
            });
            console.log(`Reassigned ${updateResult.count} purchases from ${id} to ${replacementProduct.id}`);
        } else {
            // If no replacement found, check if there are purchases.
            // If there are purchases and no replacement, we can't delete safely without losing data.
            // But the user insisted on deleting.
            // For now, let's try to delete. If it fails, the catch block will handle it.
            // Alternatively, we could prevent deletion if purchases exist and no replacement is found.
            const purchaseCount = await prisma.purchase.count({ where: { productId: id } });
            if (purchaseCount > 0) {
                return NextResponse.json({ error: "Cannot delete product with existing purchases (no replacement found)" }, { status: 400 });
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
