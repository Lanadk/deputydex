import type { Metadata } from "next";
import GroupePageClient from "@/app/(ui)/(views)/(db)/groupes/[code]/groupe-page-client";
import { getCurrentLegislatureUseCase } from "@/app/domains/legislatures/use-cases/get-current-legislature.use-case";
import { prismaLegislaturesRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislatures.repository";
import { getGroupeInfosUseCase } from "@/app/domains/groupes/use-cases/get-groupe-infos.use-case";
import { prismaGroupeInfosRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupe-infos.repository";
import { isOk } from "@/app/_shared/result-pattern/result";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ code: string }>;
}): Promise<Metadata> {
    const { code } = await params;

    try {
        const legislatureResult = await getCurrentLegislatureUseCase(prismaLegislaturesRepository);
        if (!isOk(legislatureResult)) return {};

        const infosResult = await getGroupeInfosUseCase(
            prismaGroupeInfosRepository,
            code,
            legislatureResult.data.number
        );
        if (!isOk(infosResult)) return {};

        const { groupeLabel, groupeCountMembers, groupePresidentFullName } = infosResult.data;
        const description = `Découvrez le groupe parlementaire ${groupeLabel} à l'Assemblée nationale : ${groupeCountMembers} membres, présidé par ${groupePresidentFullName}.`;

        return {
            title: groupeLabel,
            description,
            alternates: { canonical: `/groupes/${code}` },
            openGraph: {
                title: `${groupeLabel} | Députédex`,
                description,
                url: `/groupes/${code}`,
            },
        };
    } catch (e) {
        console.error(e);
        return {};
    }
}

export default async function GroupePage({
                                             params,
                                         }: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;

    return <GroupePageClient code={code} />;
}
