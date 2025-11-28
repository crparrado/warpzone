const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
    const pcs = [
        { name: 'PC 1', status: 'AVAILABLE', parsecLink: 'https://parsec.gg/link/pc1' },
        { name: 'PC 2', status: 'AVAILABLE', parsecLink: 'https://parsec.gg/link/pc2' },
        { name: 'PC 3', status: 'AVAILABLE', parsecLink: 'https://parsec.gg/link/pc3' },
        { name: 'PC 4', status: 'AVAILABLE', parsecLink: 'https://parsec.gg/link/pc4' },
    ]

    // Fetch all existing PCs ordered by creation date (oldest first)
    // This ensures we update the original PCs (preserving history) and delete newer duplicates
    const existingPCs = await prisma.pC.findMany({ orderBy: { createdAt: 'asc' } });

    console.log(`Found ${existingPCs.length} existing PCs.`);

    for (let i = 0; i < pcs.length; i++) {
        const targetPC = pcs[i];

        if (i < existingPCs.length) {
            // Update existing PC (rename old PC-01 to PC 1, etc.)
            console.log(`Updating existing PC: ${existingPCs[i].name} -> ${targetPC.name}`);
            await prisma.pC.update({
                where: { id: existingPCs[i].id },
                data: targetPC
            });
        } else {
            // Create new PC if we don't have enough
            console.log(`Creating new PC: ${targetPC.name}`);
            await prisma.pC.create({ data: targetPC });
        }
    }

    // Delete any extra PCs (duplicates created by previous runs)
    if (existingPCs.length > pcs.length) {
        const toDelete = existingPCs.slice(pcs.length);
        console.log(`Deleting ${toDelete.length} extra/duplicate PCs...`);
        for (const pc of toDelete) {
            try {
                await prisma.pC.delete({ where: { id: pc.id } });
            } catch (e) {
                console.error(`Could not delete PC ${pc.name} (id: ${pc.id}). It might have reservations. Error: ${e.message}`);
                // If we can't delete it, at least mark it as MAINTENANCE or rename it to avoid confusion?
                // For now, let's just log it. In a strict cleanup we might need to delete reservations first.
            }
        }
    }
    console.log('✅ Seeded 4 PCs (Idempotent)')

    // Seed Games
    const gamesDir = path.join(__dirname, '../public/games');
    if (fs.existsSync(gamesDir)) {
        const gameFiles = fs.readdirSync(gamesDir).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

        for (const file of gameFiles) {
            const name = path.parse(file).name.replace(/_/g, ' '); // Replace underscores with spaces
            const imageUrl = `/games/${file}`;

            const existingGame = await prisma.game.findFirst({ where: { imageUrl } });

            if (existingGame) {
                await prisma.game.update({
                    where: { id: existingGame.id },
                    data: { name, active: true, maxCopies: 1 } // Default: 1 copy (change manually for multi-license games)
                });
            } else {
                await prisma.game.create({
                    data: { name, imageUrl, active: true, maxCopies: 1 } // Default: 1 copy
                });
            }
        }
        console.log(`✅ Seeded ${gameFiles.length} games`);
    }

    // Create Admin Users
    const admins = [
        { email: "crparrado@gmail.com", name: "Cristobal Parrado", password: "mono1234" },
        { email: "martongas89@gmail.com", name: "Martoz", password: "Draculaura123" }
    ];

    for (const admin of admins) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        await prisma.user.upsert({
            where: { email: admin.email },
            update: {
                role: "ADMIN",
                password: hashedPassword
            },
            create: {
                email: admin.email,
                name: admin.name,
                password: hashedPassword,
                role: "ADMIN",
                minutes: 999999
            }
        });
    }
    console.log('✅ Admin configured: crparrado@gmail.com');

    // Seed Products
    const products = [
        { name: "1 HORA", price: 2000, minutes: 60, type: "Ficha", description: "Partida Rápida", popular: false },
        { name: "3 HORAS", price: 5000, minutes: 180, type: "Pase", description: "Tarde de Gaming", popular: false },
        { name: "5 HORAS", price: 8000, minutes: 300, type: "Pase", description: "Maratón", popular: true },
        { name: "DAY PASS", price: 15000, minutes: 720, type: "Pase", description: "Todo el día (12hrs)", popular: false },
        { name: "NIGHT PASS", price: 12000, minutes: 480, type: "Pase", description: "Toda la noche (8hrs)", popular: false }
    ];

    for (const product of products) {
        const existingProduct = await prisma.product.findFirst({ where: { name: product.name } });
        if (existingProduct) {
            await prisma.product.update({
                where: { id: existingProduct.id },
                data: product
            });
        } else {
            await prisma.product.create({ data: product });
        }
    }
    console.log(`✅ Seeded ${products.length} products`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(0) // Don't crash the deployment if seed fails
    })

