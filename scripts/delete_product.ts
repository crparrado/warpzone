import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Find the product
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: '1 HORA',
                mode: 'insensitive'
            }
        }
    });

    console.log('Found products:', products);

    if (products.length === 0) {
        console.log('No product found.');
        return;
    }

    // Assuming the user wants to delete the specific one they mentioned. 
    // If there are multiple, we might need to be careful, but usually names are unique enough or I'll pick the one that looks like the "mistake".
    // For now, let's just log them and if there's only one, proceed.

    if (products.length > 1) {
        console.log('Multiple products found. Please specify which ID to delete.');
        return;
    }

    const productToDelete = products[0];
    console.log(`Deleting product: ${productToDelete.name} (${productToDelete.id})`);

    // 2. Delete associated purchases
    const deletePurchases = await prisma.purchase.deleteMany({
        where: {
            productId: productToDelete.id
        }
    });

    console.log(`Deleted ${deletePurchases.count} associated purchases.`);

    // 3. Delete the product
    const deleteProduct = await prisma.product.delete({
        where: {
            id: productToDelete.id
        }
    });

    console.log('Product deleted successfully:', deleteProduct);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
