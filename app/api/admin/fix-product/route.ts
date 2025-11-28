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

        const productIds = products.map(p => p.id);

        // 2. Delete associated purchases for ALL found products
        const deletePurchases = await prisma.purchase.deleteMany({
            where: {
                productId: { in: productIds }
            }
        });

        // 3. Delete ALL found products
        const deleteProducts = await prisma.product.deleteMany({
            where: {
                id: { in: productIds }
            }
        });

        return NextResponse.json({
            success: true,
            deletedProductsCount: deleteProducts.count,
            deletedPurchasesCount: deletePurchases.count,
            productsFound: products.map(p => p.name)
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
