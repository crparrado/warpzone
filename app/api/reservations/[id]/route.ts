import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = cookies().get("user_session");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = JSON.parse(session.value);
  const id = params.id;

  // Verify ownership
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation || reservation.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Calculate refund amount
  const start = new Date(reservation.startTime);
  const end = new Date(reservation.endTime);
  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = Math.floor(durationMs / (1000 * 60));

  await prisma.$transaction(async (tx) => {
    // Refund minutes
    await tx.user.update({
      where: { id: user.id },
      data: { minutes: { increment: durationMinutes } }
    });

    // Delete reservation
    await tx.reservation.delete({
      where: { id },
    });
  });

  return NextResponse.json({ success: true });
}
