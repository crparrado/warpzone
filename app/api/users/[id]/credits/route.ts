import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { minutes } = body;

        if (typeof minutes !== "number") {
            return NextResponse.json(
                { error: "Invalid minutes value" },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: {
                minutes: {
                    increment: minutes,
                },
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating credits:", error);
        return NextResponse.json(
            { error: "Error updating credits" },
            { status: 500 }
        );
    }
}
