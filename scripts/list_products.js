require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Connecting to database...");
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.log("Products found:");
    console.log(JSON.stringify(products, null, 2));
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.();
  }
}

main();
