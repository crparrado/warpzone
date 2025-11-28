import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { active } = await req.json();

        const game = await prisma.game.update({
            where: { id: params.id },
            data: { active }
        });

        return NextResponse.json(game);
    } catch (error) {
        return NextResponse.json({ error: "Error updating game" }, { status: 500 });
    }
}
