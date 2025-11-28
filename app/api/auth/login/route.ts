import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    // Check password with bcrypt
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    // Set simple session cookie
    cookies().set("user_session", JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
    });

    return NextResponse.json({ success: true, user });
}
