import { NextResponse } from 'next/server';
import {prisma} from "@/prisma/prisma";

export async function GET() {
    try {
        const acteurs = await prisma.acteurs.findMany();
        return NextResponse.json(acteurs);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch acteurs' },
            { status: 500 }
        );
    }
}