import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
    const pcs = await prisma.pC.findMany({
        take: 4,
        orderBy: { name: 'asc' }
    });
    return NextResponse.json(pcs);
}

export async function PUT(request: Request) {
    const body = await request.json();
    const { id, name, parsecLink, status } = body;

    const updatedPC = await prisma.pC.update({
        where: { id },
        data: { name, parsecLink, status },
    });

    return NextResponse.json(updatedPC);
}
