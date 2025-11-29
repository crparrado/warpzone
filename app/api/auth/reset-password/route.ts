import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
        }

        // Find token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        if (!resetToken) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // Check expiration
        if (new Date() > resetToken.expires) {
            await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
            return NextResponse.json({ error: "Token expired" }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await prisma.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword }
        });

        // Delete used token
        await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

        // Also delete any other tokens for this email
        await prisma.passwordResetToken.deleteMany({ where: { email: resetToken.email } });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
