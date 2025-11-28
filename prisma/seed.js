const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
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
        console.log(`✅ Admin configured: ${admin.email}`);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

