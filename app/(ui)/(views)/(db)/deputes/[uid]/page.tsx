import { notFound } from "next/navigation";
import DeputePageClient from "@/app/(ui)/(views)/(db)/deputes/[uid]/depute-page-client";
import { getDeputeLegislaturesUseCase } from "@/app/domains/deputes/use-cases/get-depute-legislatures.use-case";
import { prismaDeputeLegislaturesRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-legislatures.repository";
import { isUnknownEntity } from "@/app/(ui)/_shared/routing/unknown-entity";

export default async function DeputePage({
    params,
}: {
    params: Promise<{ uid: string }>;
}) {
    const { uid } = await params;

    // Député n'ayant siégé dans aucune législature : 404 (une panne de la base n'en est pas une).
    const legislatures = await getDeputeLegislaturesUseCase(prismaDeputeLegislaturesRepository, uid);
    if (isUnknownEntity(legislatures)) notFound();

    return <DeputePageClient uid={uid} />;
}
