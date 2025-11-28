import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendParsecLinkEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    // Check for authorization (optional but recommended for cron jobs)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new Response('Unauthorized', { status: 401 });
    // }

    try {
        const now = new Date();
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
        const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

        // Find reservations starting in the next 5-10 minutes that haven't received the link
        const upcomingReservations = await prisma.reservation.findMany({
            where: {
                startTime: {
                    gte: now,
                    lte: tenMinutesFromNow // Check within a window to be safe
                },
                status: "CONFIRMED",
                linkSent: false,
                pc: {
                    parsecLink: {
                        not: null
                    }
                }
            },
            include: {
                user: true,
                pc: true,
                game: true
            }
        });

        console.log(`[CRON] Found ${upcomingReservations.length} reservations to process.`);

        const results = [];

        for (const reservation of upcomingReservations) {
            if (reservation.pc.parsecLink) {
                console.log(`[CRON] Sending email to ${reservation.user.email} for reservation ${reservation.id}`);

                await sendParsecLinkEmail(
                    reservation.user.email,
                    reservation.pc.parsecLink,
                    reservation.user.name || "Gamer",
                    reservation.game?.name
                );

                // Update reservation to mark link as sent
                await prisma.reservation.update({
                    where: { id: reservation.id },
                    data: { linkSent: true }
                });

                results.push({ id: reservation.id, email: reservation.user.email, status: "sent" });
            }
        }

        return NextResponse.json({ success: true, processed: results.length, details: results });

    } catch (error) {
        console.error("[CRON] Error processing reservations:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
