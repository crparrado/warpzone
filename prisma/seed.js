const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
    const pcs = [
        { name: 'PC-01 (RTX 4060)', status: 'AVAILABLE', parsecLink: 'https://parsec.gg/link/pc1' },
        { name: 'PC-02 (RTX 4060)', status: 'AVAILABLE', parsecLink: 'https://parsec.gg/link/pc2' },
        { name: 'PC-03 (RTX 3070)', status: 'AVAILABLE', parsecLink: 'https://parsec.gg/link/pc3' },
        { name: 'PC-04 (RTX 3070)', status: 'AVAILABLE', parsecLink: 'https://parsec.gg/link/pc4' },
    ]

    // Clean up existing PCs to prevent duplicates (keep only the 4 expected ones)
    // This is a bit drastic but ensures we stick to the 4 defined PCs
    const existingPCs = await prisma.pC.findMany();
    if (existingPCs.length > 4) {
        console.log('Found more than 4 PCs, cleaning up...');
        await prisma.pC.deleteMany({});
    }

    for (const pc of pcs) {
        // We try to find a PC by name first to update it, or create if not exists
        // Since name might not be unique in schema, we use findFirst
        const existing = await prisma.pC.findFirst({ where: { name: pc.name } });

        if (existing) {
            await prisma.pC.update({
                where: { id: existing.id },
                data: pc
            });
        } else {
            await prisma.pC.create({ data: pc });
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
                    data: { name, active: true }
                });
            } else {
                await prisma.game.create({
                    data: { name, imageUrl, active: true }
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

