import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPurchaseConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("One.lat Webhook received:", body);

        // One.lat sends status, external_id, etc.
        // Format might vary, but usually: { status: 'PAID', external_id: '...', ... }

        const { status, external_id } = body;

        if (status === "PAID" || status === "COMPLETED") {
            const purchase = await prisma.purchase.findUnique({
                where: { id: external_id },
                include: { user: true, product: true }
            });

            if (!purchase) {
                console.error(`Purchase not found for external_id: ${external_id}`);
                return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
            }

            if (purchase.status === "COMPLETED") {
                console.log(`Purchase ${external_id} already completed.`);
                return NextResponse.json({ message: "Already processed" });
            }

            // Update purchase and user credits transactionally
            await prisma.$transaction(async (tx) => {
                // 1. Mark purchase as completed
                await tx.purchase.update({
                    where: { id: purchase.id },
                    data: { status: "COMPLETED" }
                });

                // 2. Add credits to user
                await tx.user.update({
                    where: { id: purchase.userId },
                    data: {
                        minutes: { increment: purchase.product.minutes },
                        totalHoursPurchased: { increment: Math.floor(purchase.product.minutes / 60) }
                    }
                });
            });

            console.log(`Credits added for user ${purchase.user.email}`);

            // 3. Send Confirmation Email
            await sendPurchaseConfirmationEmail(
                purchase.user.email,
                purchase.user.name || "Gamer",
                purchase.product.name,
                purchase.amount,
                purchase.product.minutes,
                purchase.id
            );

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ message: "Status ignored" });

    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
