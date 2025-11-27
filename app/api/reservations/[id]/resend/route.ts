import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendParsecLinkEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
            user: true,
            pc: true
        }
    });

    if (!reservation) {
        return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
    }

    console.log(`[ADMIN] Resending Parsec Link for reservation ${id} to ${reservation.user.email}`);

    await sendParsecLinkEmail(
        reservation.user.email,
        reservation.pc.parsecLink || "https://parsec.app"
    );

    return NextResponse.json({ success: true });
}
