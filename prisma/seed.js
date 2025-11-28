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

    for (const pc of pcs) {
        await prisma.pC.create({
            data: pc,
        })
    }
    console.log('Seeded 4 PCs')

    // Create Admin Users
    const admins = [
        { email: "crparrado@gmail.com", name: "Cristobal Parrado" },
        { email: "martongas89@gmail.com", name: "Martoz" }
    ];

    for (const admin of admins) {
        await prisma.user.upsert({
            where: { email: admin.email },
            update: { role: "ADMIN" },
            create: {
                email: admin.email,
                name: admin.name,
                password: await bcrypt.hash("mono1234", 10), // Updated password
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

