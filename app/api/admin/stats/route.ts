import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 1. Active Users (Total users)
        const activeUsers = await prisma.user.count();

        // 2. Reservations Today
        const reservationsToday = await prisma.reservation.count({
            where: {
                startTime: {
                    gte: startOfDay,
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
                    gte: startOfMonth,
                },
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
