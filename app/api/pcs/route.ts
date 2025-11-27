import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
    const pcs = await prisma.pC.findMany();
    return NextResponse.json(pcs);
}

export async function PUT(request: Request) {
    const body = await request.json();
    const { id, parsecLink, status } = body;

    const updatedPC = await prisma.pC.update({
        where: { id },
        data: { parsecLink, status },
    });

    return NextResponse.json(updatedPC);
}
