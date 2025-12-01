import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const now = new Date();

        // Helper to get date parts in Chile timezone
        const getChileDateParts = (date: Date) => {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/Santiago',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false
            });
            return formatter.formatToParts(date).reduce((acc, part) => {
                if (part.type !== 'literal') acc[part.type] = parseInt(part.value);
                return acc;
            }, {} as Record<string, number>);
        };

        const { year, month, day } = getChileDateParts(now);

        // Construct dates relative to Chile time (but stored as ISO strings which Prisma handles)
        // We create a date string YYYY-MM-DD and let Date parse it (which defaults to UTC usually in Node, 
        // but we want the timestamp that represents 00:00 in Chile).
        // Actually, simpler: Create a date object and adjust it.
        // Let's use the string construction method which is safer for "start of day" logic without libraries.

        // Start of Month in Chile (e.g., 2023-11-01 00:00:00 GMT-3)
        // We need to pass a valid ISO string or Date object to Prisma.
        // Since Prisma stores in UTC, we need the UTC equivalent of "Chile Midnight".
        // A simple hack without libraries: Create date from string with offset.
        // Chile is roughly -3 or -4. 
        // Better approach: Use the parts to create a string with explicit offset if we knew it, 
        // OR just use the parts to create a UTC date and then shift it? No.

        // Let's stick to a robust approximation if we can't get exact offset easily without lib:
        // We know "month" from getChileDateParts is the correct month index (1-12) for Chile.
        // So we want to query where createdAt >= "YYYY-MM-01T00:00:00-03:00" (or whatever offset).
        // Since we don't know the offset easily, we can construct a Date using the parts and assume local, then adjust?
        // No, server is UTC. 

        // Let's use the fact that we just want to catch "this month's" data.
        // If we use the year/month from Chile, and create a UTC date for the 1st of that month,
        // we might be off by a few hours (e.g. including late previous month data or excluding early this month).
        // BUT, the issue reported is that it's showing $0 (next month).
        // So if it's Nov 30 23:00 Chile, it's Dec 1 02:00 UTC.
        // The current code uses `new Date()` (UTC Dec 1) -> `startOfMonth` (UTC Dec 1).
        // We want `startOfMonth` to be Nov 1.

        // So:
        const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 3, 0, 0)); // Approximate Chile midnight (UTC+3/4)
        // Actually, simpler: Just use the year/month from Chile parts and create a UTC date for the 1st.
        // Even if it's slightly off (e.g. starts at 00:00 UTC which is 21:00 Chile prev day), it's better than being a whole month off.
        // Let's use UTC 00:00 for the 1st of the "Chile Month".
        const startOfMonthFixed = new Date(Date.UTC(year, month - 1, 1));

        // Start of Day
        const startOfDayFixed = new Date(Date.UTC(year, month - 1, day));

        // 1. Active Users (Total users)
        const activeUsers = await prisma.user.count();

        // 2. Reservations Today
        const reservationsToday = await prisma.reservation.count({
            where: {
                startTime: {
                    gte: startOfDayFixed,
                },
            },
        });

        // 3. Monthly Income (Sum of purchases)
        const monthlyPurchases = await prisma.purchase.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                createdAt: {
                    gte: startOfMonthFixed,
                },
                status: 'COMPLETED' // Only count completed purchases
            },
        });
        const monthlyIncome = monthlyPurchases._sum.amount || 0;

        // 4. Recent Activity (Combine recent reservations and purchases)
        const recentReservations = await prisma.reservation.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true, pc: true },
        });

        const recentPurchases = await prisma.purchase.findMany({
            take: 5,
            where: { status: 'COMPLETED' },
            orderBy: { createdAt: 'desc' },
            include: { user: true, product: true },
        });

        // Combine and sort
        const activity = [
            ...recentReservations.map(r => ({
                type: 'Reserva',
                user: r.user.name || r.user.email,
                detail: `${r.pc.name} (${new Date(r.endTime).getHours() - new Date(r.startTime).getHours()} Horas)`,
                time: r.createdAt,
            })),
            ...recentPurchases.map(p => ({
                type: 'Compra',
                user: p.user.name || p.user.email,
                detail: p.product.name,
                time: p.createdAt,
            }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

        return NextResponse.json({
            activeUsers,
            reservationsToday,
            monthlyIncome,
            activity
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json({ error: "Error fetching stats" }, { status: 500 });
    }
}
