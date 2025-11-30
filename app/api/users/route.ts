import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const where = search ? {
        OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
        ]
    } : {};

    const users = await prisma.user.findMany({
        where: where as any, // Type assertion needed for insensitive mode sometimes depending on Prisma version
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
