import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = cookies().get("user_session");
    if (!session) {
        return NextResponse.json(null);
    }

    try {
        const sessionUser = JSON.parse(session.value);
        const user = await prisma.user.findUnique({
            where: { id: sessionUser.id }
        });

        if (!user) return NextResponse.json(null);

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json(null);
    }
}
