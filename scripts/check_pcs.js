const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const pcs = await prisma.pC.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { reservations: true } } }
    })
    console.log(JSON.stringify(pcs, null, 2))
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.()
  }
}

main()
