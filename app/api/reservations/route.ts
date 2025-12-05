import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const reservations = await prisma.reservation.findMany({
        include: {
            user: true,
            pc: true,
            game: true, // Include game details
        },
        orderBy: { startTime: 'desc' }
    });
    return NextResponse.json(reservations);
}

import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
    const body = await request.json();
    const { userId, startTime, endTime, gameId } = body; // Destructure gameId here

    // 1. Verify user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // 2. Calculate duration
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    // 3. Check credits
    if (durationMinutes <= 0) return NextResponse.json({ error: "Duración inválida" }, { status: 400 });
    if (user.minutes < durationMinutes) {
        return NextResponse.json({
            error: `Saldo insuficiente. Necesitas ${durationMinutes} minutos, tienes ${user.minutes}.`
        }, { status: 400 });
    }

    // 4. Check Game Availability (if game selected)
    if (gameId) {
        // Fetch game and its maxCopies limit
        const game = await prisma.game.findUnique({ where: { id: gameId } });

        if (!game) {
            return NextResponse.json({ error: "Juego no encontrado" }, { status: 404 });
        }

        // Count how many active reservations exist for this game in the requested time range
        const conflictingGameReservations = await prisma.reservation.count({
            where: {
                gameId: gameId,
                status: { not: "CANCELLED" },
                OR: [
                    {
                        startTime: { lt: end },
                        endTime: { gt: start }
                    }
                ]
            }
        });

        // If we've reached the max copies limit, reject the reservation
        if (conflictingGameReservations >= game.maxCopies) {
            return NextResponse.json({
                error: `Lo sentimos, "${game.name}" ya está siendo usado en ese horario. Intenta otro juego u otro horario.`
            }, { status: 409 });
        }
    }

    // 5. Find Available PC (Strict Logic)
    let availablePC;
    const { pcId } = body; // Get requested PC ID

    if (pcId) {
        // A. Strict Mode: User requested a specific PC
        const requestedPC = await prisma.pC.findUnique({
            where: { id: pcId }
        });

        if (!requestedPC) {
            return NextResponse.json({ error: "El PC seleccionado no existe." }, { status: 404 });
        }

        if (requestedPC.status !== "AVAILABLE") {
            return NextResponse.json({ error: "El PC seleccionado no está disponible." }, { status: 409 });
        }

        // Check for conflicts specifically on this PC
        const conflict = await prisma.reservation.findFirst({
            where: {
                pcId: pcId,
                status: { not: "CANCELLED" },
                OR: [
                    {
                        startTime: { lt: end },
                        endTime: { gt: start }
                    }
                ]
            }
        });

        if (conflict) {
            return NextResponse.json({
                error: `El ${requestedPC.name} ya está reservado en ese horario. Por favor selecciona otro PC u otro horario.`
            }, { status: 409 });
        }

        availablePC = requestedPC;

    } else {
        // B. Fallback Mode: Auto-assign (Legacy behavior)
        // Fetch all PCs
        const allPCs = await prisma.pC.findMany({
            where: { status: "AVAILABLE" }, // Only active PCs
            orderBy: { name: 'asc' } // Prefer PC 01, then 02...
        });

        // Fetch conflicting reservations
        const conflictingReservations = await prisma.reservation.findMany({
            where: {
                OR: [
                    {
                        startTime: { lt: end },
                        endTime: { gt: start }
                    }
                ],
                status: { not: "CANCELLED" }
            },
            select: { pcId: true }
        });

        const occupiedPCIds = new Set(conflictingReservations.map(r => r.pcId));

        // Find first PC that is NOT in occupied set
        availablePC = allPCs.find(pc => !occupiedPCIds.has(pc.id));

        if (!availablePC) {
            return NextResponse.json({
                error: "Lo sentimos, no hay PCs disponibles para este horario. Intenta otra hora."
            }, { status: 409 }); // 409 Conflict
        }
    }

    // 6. Create Reservation & Deduct Credits
    const reservation = await prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: userId },
            data: { minutes: { decrement: durationMinutes } }
        });

        return await tx.reservation.create({
            data: {
                userId,
                pcId: availablePC.id,
                startTime: start,
                endTime: end,
                gameId: gameId || null, // Save gameId!
            },
            include: { pc: true, game: true } // Include game in response
        });
    });

    // 6. Send Email
    await sendConfirmationEmail(
        user.email,
        reservation.id,
        reservation.startTime,
        user.name || "Gamer",
        reservation.pc.name,
        reservation.game?.name // Pass game name
    );

    return NextResponse.json(reservation);
}

