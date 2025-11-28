import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {
  const session = cookies().get("user_session");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = JSON.parse(session.value);

  const reservations = await prisma.reservation.findMany({
    where: { userId: user.id },
    include: { pc: true, game: true },
    orderBy: { startTime: 'desc' }
  });

  return NextResponse.json(reservations);
}
