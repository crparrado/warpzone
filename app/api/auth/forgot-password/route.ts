import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Return success even if user not found to prevent enumeration
            return NextResponse.json({ success: true });
        }

        // Generate token
        const token = uuidv4();
        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour from now

        // Save token
        await prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expires
            }
        });

        // Send email
        await sendPasswordResetEmail(email, token, user.name || "Gamer");

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error requesting password reset:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
