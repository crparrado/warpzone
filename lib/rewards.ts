import { prisma } from "@/lib/prisma";

export async function processPurchaseRewards(userId: string, productId: string, purchaseId?: string) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        throw new Error("Product not found");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("User not found");
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
        let purchase;

        if (purchaseId) {
            purchase = await tx.purchase.findUnique({ where: { id: purchaseId } });

            if (!purchase) {
                throw new Error("Purchase not found");
            }

            // Idempotency check
            if (purchase.status === "COMPLETED") {
                return { purchase, newlyUnlocked: [], totalBonusMinutes: 0, newLevel: user.level, alreadyCompleted: true };
            }

            // Update status to COMPLETED
            purchase = await tx.purchase.update({
                where: { id: purchaseId },
                data: { status: "COMPLETED" }
            });
        } else {
            // Create Purchase Record (for direct buy route) - assumed COMPLETED immediately
            purchase = await tx.purchase.create({
                data: {
                    userId,
                    productId,
                    amount: product.price,
                    status: "COMPLETED",
                },
            });
        }

        // Update User: add minutes, track hours, update level, unlock achievements
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

        return { purchase, newlyUnlocked, totalBonusMinutes, newLevel, alreadyCompleted: false };
    });

    return result;
}
