import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendParsecLinkEmail } from "@/lib/email";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);

    // Find reservations starting in the next 5-10 minutes that haven't been notified (simplified logic)
    // In a real app, we'd have a 'notified' flag. Here we just query by time window.
    const upcomingReservations = await prisma.reservation.findMany({
        where: {
            startTime: {
                gte: now,
                lte: fiveMinutesFromNow,
            },
            status: "CONFIRMED",
        },
        include: { user: true, pc: true },
    });

    for (const reservation of upcomingReservations) {
        if (reservation.pc.parsecLink) {
            await sendParsecLinkEmail(reservation.user.email, reservation.pc.parsecLink);
            console.log(`Sent link to ${reservation.user.email}`);
        }
    }

    return NextResponse.json({ processed: upcomingReservations.length });
}
