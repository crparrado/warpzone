import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        await prisma.game.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Game deleted successfully" });
    } catch (error) {
        console.error("Error deleting game:", error);
        return NextResponse.json({ error: "Error deleting game" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { active } = await req.json();

        const updatedGame = await prisma.game.update({
            where: { id },
            data: { active },
        });

        return NextResponse.json(updatedGame);
    } catch (error) {
        console.error("Error updating game:", error);
        return NextResponse.json({ error: "Error updating game" }, { status: 500 });
    }
}
