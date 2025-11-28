import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const achievements = await prisma.achievement.findMany({
            orderBy: { milestone: 'asc' }
        });
        return NextResponse.json(achievements);
    } catch (error) {
        console.error("Error fetching achievements:", error);
        return NextResponse.json({ error: "Error fetching achievements" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, milestone, reward, icon } = body;

        if (!name || !description || !milestone || !reward) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const achievement = await prisma.achievement.create({
            data: { name, description, milestone, reward, icon }
        });

        return NextResponse.json(achievement);
    } catch (error) {
        console.error("Error creating achievement:", error);
        return NextResponse.json({ error: "Error creating achievement" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, description, milestone, reward, icon } = body;

        const achievement = await prisma.achievement.update({
            where: { id },
            data: { name, description, milestone, reward, icon }
        });

        return NextResponse.json(achievement);
    } catch (error) {
        console.error("Error updating achievement:", error);
        return NextResponse.json({ error: "Error updating achievement" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        await prisma.achievement.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting achievement:", error);
        return NextResponse.json({ error: "Error deleting achievement" }, { status: 500 });
    }
}
