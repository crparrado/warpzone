import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.systemSettings.findFirst();
        return NextResponse.json(settings || { generalDiscount: 0 });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching settings" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { generalDiscount } = await req.json();

        // Upsert settings (we only want one row)
        const firstSetting = await prisma.systemSettings.findFirst();

        let settings;
        if (firstSetting) {
            settings = await prisma.systemSettings.update({
                where: { id: firstSetting.id },
                data: { generalDiscount }
            });
        } else {
            settings = await prisma.systemSettings.create({
                data: { generalDiscount }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Error updating settings" }, { status: 500 });
    }
}
