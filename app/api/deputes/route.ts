import { NextResponse } from 'next/server';
import {prisma} from "@/app/lib/prisma/prisma";

// GET /api/deputes
export async function GET() {
    try {
        const deputes = await prisma.deputes.findMany({
            take: 100
        });

        return NextResponse.json(deputes);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch deputes' },
            { status: 500 }
        );
    }
}