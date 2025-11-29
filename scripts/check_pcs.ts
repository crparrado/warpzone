import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const pcs = await prisma.pC.findMany({
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { reservations: true } } }
  })
  console.log(JSON.stringify(pcs, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.())
