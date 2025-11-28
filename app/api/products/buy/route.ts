import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { userId, productId } = await req.json();

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Get current user data
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate hours purchased (convert minutes to hours)
        const hoursPurchased = Math.floor(product.minutes / 60);
        const newTotalHours = user.totalHoursPurchased + hoursPurchased;
        const newLevel = newTotalHours; // 1 hour = 1 level

        // Get all achievements
        const allAchievements = await prisma.achievement.findMany({
            orderBy: { milestone: 'asc' }
        });

        // Find newly unlocked achievements
        const newlyUnlocked: string[] = [];
        let totalBonusMinutes = 0;

        for (const achievement of allAchievements) {
            const wasUnlocked = user.achievementsUnlocked.includes(achievement.id);
            const shouldBeUnlocked = newTotalHours >= achievement.milestone;

            if (!wasUnlocked && shouldBeUnlocked) {
                newlyUnlocked.push(achievement.id);
                totalBonusMinutes += achievement.reward * 60; // Convert reward hours to minutes
            }
        }

        // Perform all updates in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Purchase Record
            const purchase = await tx.purchase.create({
                data: {
                    userId,
                    productId,
                    amount: product.price,
                },
            });

            // 2. Update User: add minutes, track hours, update level, unlock achievements
            await tx.user.update({
                where: { id: userId },
                data: {
                    minutes: {
                        increment: product.minutes + totalBonusMinutes,
                    },
                    totalHoursPurchased: newTotalHours,
                    level: newLevel,
                    achievementsUnlocked: {
                        push: newlyUnlocked,
                    },
                },
            });

            return { purchase, newlyUnlocked, totalBonusMinutes };
        });

        return NextResponse.json({
            success: true,
            purchase: result.purchase,
            newLevel,
            achievementsUnlocked: result.newlyUnlocked.length,
            bonusMinutes: totalBonusMinutes,
        });
    } catch (error) {
        console.error("Error processing purchase:", error);
        return NextResponse.json({ error: "Error processing purchase" }, { status: 500 });
    }
}
