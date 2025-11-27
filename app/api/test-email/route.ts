import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const to = searchParams.get("to");

    if (!to) {
        return NextResponse.json({ error: "Missing 'to' query parameter" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "RESEND_API_KEY is missing in environment variables" }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    try {
        const data = await resend.emails.send({
            from: 'Warpzone <reservas@warpzone.cl>',
            to: [to],
            subject: 'Test de Email Warpzone 🧪',
            html: '<h1>Funciona!</h1><p>Si lees esto, el envío de correos está configurado correctamente.</p>',
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
