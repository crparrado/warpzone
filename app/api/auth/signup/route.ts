import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const body = await request.json();
    const { name, email, password } = body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
        }

        const existingName = await prisma.user.findFirst({ where: { name } });
        if (existingName) {
            return NextResponse.json({ error: "El nombre de usuario ya está en uso" }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password, // In production, hash this!
                role: "USER",
            },
        });

        // Auto-login after signup
        cookies().set("user_session", JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json({ error: "Error al crear cuenta" }, { status: 500 });
    }
}
