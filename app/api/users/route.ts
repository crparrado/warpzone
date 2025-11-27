import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { email, name, role } = body;

    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
                role: role || 'USER',
            },
        });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    }
}
