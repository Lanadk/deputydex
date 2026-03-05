import { NextResponse } from 'next/server';
import {prisma} from "@/app/lib/prisma/prisma";

// GET /api/acteurs/:uid
export async function GET(
    request: Request,
    { params }: { params: Promise<{ uid: string }> }
) {
    const { uid } = await params
    try {
        const acteur = await prisma.acteurs.findUnique({
            where: { uid: uid },
            include: {
                adressesPostales: true,
                adressesMails: true,
                reseauxSociaux: true,
                telephones: true,
            }
        });

        if (!acteur) {
            return NextResponse.json(
                { error: 'Acteur not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(acteur);

    } catch (error) {
        console.error('Error fetching acteur:', error);
        return NextResponse.json(
            { error: 'Failed to fetch acteur' },
            { status: 500 }
        );
    }
}