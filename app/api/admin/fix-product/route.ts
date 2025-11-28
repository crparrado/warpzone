import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key !== "warpzone_fix_2025") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 1. Find the product
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: '1 HORA',
                    mode: 'insensitive'
                }
            }
        });

        if (products.length === 0) {
            return NextResponse.json({ message: "No product found with name '1 HORA'" });
        }

        const productToDelete = products[0]; // Take the first match

        // 2. Delete associated purchases
        const deletePurchases = await prisma.purchase.deleteMany({
            where: {
                productId: productToDelete.id
            }
        });

        // 3. Delete the product
        const deleteProduct = await prisma.product.delete({
            where: {
                id: productToDelete.id
            }
        });

        return NextResponse.json({
            success: true,
            deletedProduct: deleteProduct,
            deletedPurchasesCount: deletePurchases.count
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
