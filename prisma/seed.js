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
    // Delete any extra PCs (duplicates created by previous runs)
    // DISABLED: This causes errors if the extra PCs have reservations.
    // We should not delete PCs automatically in production.
    /*
    if (existingPCs.length > pcs.length) {
        const toDelete = existingPCs.slice(pcs.length);
        console.log(`Deleting ${toDelete.length} extra/duplicate PCs...`);
        for (const pc of toDelete) {
            try {
                await prisma.pC.delete({ where: { id: pc.id } });
            } catch (e) {
                console.error(`Could not delete PC ${pc.name} (id: ${pc.id}). It might have reservations. Error: ${e.message}`);
            }
        }
    }
    */
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
                    data: { name } // Only update name to match filename, preserve active status and maxCopies
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
        // Find ALL products with this name to check for duplicates
        const existingProducts = await prisma.product.findMany({
            where: { name: product.name },
            orderBy: { createdAt: 'asc' }
        });

        if (existingProducts.length > 0) {
            // Update the first one (oldest)
            const toKeep = existingProducts[0];
            console.log(`Updating existing product: ${toKeep.name} (${toKeep.id})`);
            await prisma.product.update({
                where: { id: toKeep.id },
                data: product
            });

            // Delete duplicates if any
            if (existingProducts.length > 1) {
                const toDelete = existingProducts.slice(1);
                console.log(`Found ${toDelete.length} duplicates for ${product.name}. Deleting...`);
                for (const duplicate of toDelete) {
                    try {
                        // Check if it has purchases before deleting? 
                        // The user specifically asked to delete the extra one.
                        // We'll try to delete. If it fails due to constraints, we'll log it.
                        await prisma.product.delete({ where: { id: duplicate.id } });
                        console.log(`Deleted duplicate product: ${duplicate.name} (${duplicate.id})`);
                    } catch (e) {
                        console.error(`Could not delete duplicate product ${duplicate.name} (${duplicate.id}): ${e.message}`);
                    }
                }
            }
        } else {
            console.log(`Creating new product: ${product.name}`);
            await prisma.product.create({ data: product });
        }
    }
    console.log(`✅ Seeded ${products.length} products`);

    // Seed Achievements
    const achievements = [
        { name: "Novato", milestone: 10, reward: 2, description: "Alcanzaste 10 horas compradas", icon: "🎮" },
        { name: "Aficionado", milestone: 25, reward: 5, description: "Alcanzaste 25 horas compradas", icon: "🎯" },
        { name: "Entusiasta", milestone: 50, reward: 10, description: "Alcanzaste 50 horas compradas", icon: "⚡" },
        { name: "Dedicado", milestone: 75, reward: 15, description: "Alcanzaste 75 horas compradas", icon: "🔥" },
        { name: "Veterano", milestone: 100, reward: 20, description: "Alcanzaste 100 horas compradas", icon: "💎" },
        { name: "Maestro", milestone: 125, reward: 25, description: "Alcanzaste 125 horas compradas", icon: "👑" },
        { name: "Leyenda", milestone: 150, reward: 30, description: "Alcanzaste 150 horas compradas", icon: "⭐" },
        { name: "Titán", milestone: 175, reward: 35, description: "Alcanzaste 175 horas compradas", icon: "🏆" },
        { name: "Dios del Gaming", milestone: 200, reward: 40, description: "Alcanzaste 200 horas compradas", icon: "👾" }
    ];

    for (const achievement of achievements) {
        const existing = await prisma.achievement.findFirst({ where: { milestone: achievement.milestone } });
        if (existing) {
            await prisma.achievement.update({
                where: { id: existing.id },
                data: achievement
            });
        } else {
            await prisma.achievement.create({ data: achievement });
        }
    }
    console.log(`✅ Seeded ${achievements.length} achievements`);
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

