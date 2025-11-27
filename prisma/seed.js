const { PrismaClient } = require('@prisma/client')
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
