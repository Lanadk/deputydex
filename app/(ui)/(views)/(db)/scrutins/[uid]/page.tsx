import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ScrutinPageClient from "@/app/(ui)/(views)/(db)/scrutins/[uid]/scrutin-page-client";
import { getScrutinDetailUseCase } from "@/app/domains/scrutins/use-cases/get-scrutin-detail.use-case";
import { prismaScrutinDetailRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutin-detail.repository";
import { isOk } from "@/app/_shared/result-pattern/result";
import { capitalizeFirst } from "@/app/_shared/utils/string";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ uid: string }>;
}): Promise<Metadata> {
    const { uid } = await params;
    try {
        const result = await getScrutinDetailUseCase(prismaScrutinDetailRepository, uid);
        if (!isOk(result)) return {};

        const { numero, titre, resultat } = result.data;
        const title = numero ? `Scrutin n° ${numero}` : "Scrutin";
        const description = [resultat.libelle, titre ? capitalizeFirst(titre) : null].filter(Boolean).join(" : ");

        return {
            title,
            description,
            alternates: { canonical: `/scrutins/${uid}` },
            openGraph: { title: `${title} | Députédex`, description, url: `/scrutins/${uid}` },
        };
    } catch (e) {
        console.error(e);
        return {};
    }
}

export default async function ScrutinPage({
    params,
}: {
    params: Promise<{ uid: string }>;
}) {
    const { uid } = await params;
    const result = await getScrutinDetailUseCase(prismaScrutinDetailRepository, uid);
    if (!isOk(result) && result.error === "NOT_FOUND") notFound();

    return <ScrutinPageClient uid={uid} />;
}
