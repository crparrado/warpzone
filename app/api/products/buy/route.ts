import { NextResponse } from "next/server";
import { processPurchaseRewards } from "@/lib/rewards";

export async function POST(req: Request) {
    try {
        const { userId, productId } = await req.json();

        const result = await processPurchaseRewards(userId, productId);

        return NextResponse.json({
            success: true,
            purchase: result.purchase,
            newLevel: result.newLevel,
            achievementsUnlocked: result.newlyUnlocked.length,
            bonusMinutes: result.totalBonusMinutes,
        });
    } catch (error: any) {
        console.error("Error processing purchase:", error);
        return NextResponse.json({ error: error.message || "Error processing purchase" }, { status: 500 });
    }
}

