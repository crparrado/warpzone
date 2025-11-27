import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    const session = cookies().get("user_session");
    if (!session) {
        return NextResponse.json(null);
    }
    return NextResponse.json(JSON.parse(session.value));
}
