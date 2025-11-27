import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const reservations = await prisma.reservation.findMany({
        include: {
            user: true,
            pc: true,
        },
        orderBy: { startTime: 'desc' }
    });
    return NextResponse.json(reservations);
}

import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
    const body = await request.json();
    const { userId, pcId, startTime, endTime, email } = body;

    // Verify user exists (optional but good practice)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Create Reservation
    const reservation = await prisma.reservation.create({
        data: {
            userId,
            pcId,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
        },
        include: { pc: true }
    });

    // Send Confirmation Email
    await sendConfirmationEmail(
        user.email,
        reservation.id,
        reservation.startTime,
        user.name || "Gamer",
        reservation.pc.name
    );

    return NextResponse.json(reservation);
}

