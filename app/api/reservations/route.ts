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

    // Verify user exists and has credits
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Calculate duration in minutes
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    console.log(`[RESERVATION] User: ${user.email}, Credits: ${user.minutes}, Cost: ${durationMinutes}`);

    if (durationMinutes <= 0) {
        return NextResponse.json({ error: "Duración inválida" }, { status: 400 });
    }

    if (user.minutes < durationMinutes) {
        console.log(`[RESERVATION] Insufficient funds. Required: ${durationMinutes}, Available: ${user.minutes}`);
        return NextResponse.json({
            error: `Saldo insuficiente. Necesitas ${durationMinutes} minutos, tienes ${user.minutes}.`
        }, { status: 400 });
    }

    // Create Reservation and Deduct Minutes in Transaction
    const reservation = await prisma.$transaction(async (tx) => {
        // Deduct minutes
        await tx.user.update({
            where: { id: userId },
            data: { minutes: { decrement: durationMinutes } }
        });

        // Create reservation
        return await tx.reservation.create({
            data: {
                userId,
                pcId,
                startTime: start,
                endTime: end,
            },
            include: { pc: true }
        });
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

