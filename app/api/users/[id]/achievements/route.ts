import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;

        // Get user data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                level: true,
                totalHoursPurchased: true,
                achievementsUnlocked: true,
                minutes: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get all achievements
        const allAchievements = await prisma.achievement.findMany({
            orderBy: { milestone: 'asc' }
        });

        // Separate unlocked and locked achievements
        const unlockedAchievements = allAchievements.filter(a =>
            user.achievementsUnlocked.includes(a.id)
        );

        const lockedAchievements = allAchievements.filter(a =>
            !user.achievementsUnlocked.includes(a.id)
        );

        // Find next achievement
        const nextAchievement = lockedAchievements.find(a =>
            a.milestone > user.totalHoursPurchased
        );

        return NextResponse.json({
            level: user.level,
            totalHoursPurchased: user.totalHoursPurchased,
            currentMinutes: user.minutes,
            unlockedAchievements,
            nextAchievement,
            totalAchievements: allAchievements.length,
        });
    } catch (error) {
        console.error("Error fetching user achievements:", error);
        return NextResponse.json({ error: "Error fetching achievements" }, { status: 500 });
    }
}
