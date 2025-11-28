import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
    try {
        const games = await prisma.game.findMany({
            orderBy: { name: "asc" }
        });
        return NextResponse.json(games);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching games" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const file = formData.get("image") as File | null;

        if (!name) {
            return NextResponse.json({ error: "Missing name" }, { status: 400 });
        }

        let imageUrl = null;

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = file.name.replace(/\s+/g, "_");
            const publicPath = path.join(process.cwd(), "public/games", filename);

            await writeFile(publicPath, buffer);
            imageUrl = `/games/${filename}`;
        }

        const game = await prisma.game.create({
            data: {
                name,
                imageUrl,
                active: true
            }
        });

        return NextResponse.json(game);
    } catch (error) {
        console.error("Error creating game:", error);
        return NextResponse.json({ error: "Error creating game" }, { status: 500 });
    }
}
