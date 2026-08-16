import { CalendarDays, Users } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, ParagraphItem, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { DeputeCardData, GroupCardData } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { GroupeAgeRowDTO, GroupesAgeDTO } from "@/app/domains/groupes/dto/groupes-age.dto";
import { DeputeAgeDTO, DeputesAgeExtremesDTO } from "@/app/domains/deputes/dto/deputes-age-extremes.dto";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { card, table, GroupeAgeTableRow } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";

/**
 * Même principe que `toGroupCardData` dans `feminisation-groupes.sections.ts`
 * : `GroupeAgeRowDTO` (âge moyen) n'a ni président, ni photo, ni couleur —
 * seul `getGroupesCards` les a. Zéro nouveau backend, juste un second fetch
 * en parallèle.
 */
function toGroupCardData(row: GroupeAgeRowDTO, cards: GroupeCardDTO[], caption: string): GroupCardData {
    const found = cards.find((c) => c.groupeCode === row.groupeCode);
    return {
        code: row.groupeCode,
        libelle: row.groupeLabel,
        nbMembers: found?.groupeCountMembers,
        president: found?.groupePresidentFullName,
        sexPresidentType: found?.groupeQualitySexLabel,
        image: found?.groupeImg,
        href: found?.groupeHref ?? `/groupes/${row.groupeCode}`,
        caption,
    };
}

/** Même principe, au niveau d'un député précis plutôt que d'un groupe — voir `DeputeMiniCard`. */
function toDeputeCardData(row: DeputeAgeDTO, cards: DeputesCardDTO[], caption: string): DeputeCardData | null {
    const found = cards.find((c) => c.deputeUID === row.deputeUid);
    if (!found) return null;

    return {
        uid: row.deputeUid,
        fullName: found.deputeFullName,
        groupeCode: found.deputeGroupeCode,
        age: row.age,
        image: found.deputeImage,
        href: `/deputes/${row.deputeUid}`,
        caption,
    };
}

type GroupeAgeRecitData = { legislature: number } & GroupesAgeDTO;

/**
 * Récit dynamique côté groupes — attention au vocabulaire : ce n'est pas "le
 * groupe le plus jeune" (ça personnifierait le groupe), mais "le groupe dont
 * la moyenne d'âge est la plus basse/élevée" — la nuance compte, un groupe
 * n'a pas d'âge, ses membres oui.
 */
function buildGroupeAgeRecit(data: BlockDataWrapper | undefined): ParagraphItem[] {
    const dto = data as unknown as GroupeAgeRecitData | undefined;
    if (!dto || dto.groupes.length === 0) return [{ type: "text", content: "Données indisponibles pour l'instant." }];

    const items: ParagraphItem[] = [
        { type: "text", content: `Données pour la ${dto.legislature}ᵉ législature.` },
    ];

    if (dto.plusJeune) {
        items.push({
            type: "highlight",
            content: `${dto.plusJeune.groupeLabel} est le groupe dont la moyenne d'âge est la plus basse, avec ${dto.plusJeune.averageAge} ans en moyenne.`,
        });
    }
    if (dto.plusAge && dto.plusAge.groupeCode !== dto.plusJeune?.groupeCode) {
        items.push({
            type: "highlight",
            content: `À l'inverse, c'est chez ${dto.plusAge.groupeLabel} que la moyenne d'âge est la plus élevée, avec ${dto.plusAge.averageAge} ans en moyenne.`,
        });
    }

    if (items.length === 1) {
        items.push({ type: "text", content: "Pas assez de données d'âge pour dégager une tendance sur cette législature." });
    }

    return items;
}

type DeputeAgeRecitData = { legislature: number } & DeputesAgeExtremesDTO;

/** Récit dynamique côté individus — ici la personnification est correcte : ce sont bien des personnes qui sont jeunes ou doyen·nes, pas un groupe. */
function buildDeputeAgeRecit(data: BlockDataWrapper | undefined): ParagraphItem[] {
    const dto = data as unknown as DeputeAgeRecitData | undefined;
    if (!dto || (!dto.plusJeune && !dto.plusAge)) return [{ type: "text", content: "Données indisponibles pour l'instant." }];

    const items: ParagraphItem[] = [
        { type: "text", content: `Données pour la ${dto.legislature}ᵉ législature.` },
    ];

    if (dto.plusJeune) {
        items.push({ type: "highlight", content: `Le·la député·e le/la plus jeune de l'Assemblée a ${dto.plusJeune.age} ans.` });
    }
    if (dto.plusAge) {
        items.push({ type: "highlight", content: `Le·la doyen·ne de l'Assemblée a ${dto.plusAge.age} ans.` });
    }

    return items;
}

/**
 * "L'âge des député·es" — deux sections bien séparées (deux ancres distinctes
 * dans le sommaire, pas un seul bloc mélangeant les deux niveaux) :
 * - le classement des groupes par moyenne d'âge (méthodologie :
 *   `prisma-groupes-stats.repository.ts`, `getAgeParGroupe`) ;
 * - les extrêmes à titre individuel, le/la député·e le/la plus jeune et le/la
 *   doyen·ne (méthodologie : `prisma-deputes-age.repository.ts`,
 *   `getAgeExtremes`).
 * Gabarit copié sur `feminisation-groupes.sections.ts` (cards d'extrêmes +
 * récit + table de classement), adapté à l'âge.
 */
export const AGE_DES_DEPUTES_SECTIONS: PageSection[] = [
    {
        id: "age-des-deputes-individuel",
        label: "Les âges extrêmes",
        icon: CalendarDays,
        description: "Au-delà des moyennes, qui sont le/la plus jeune et le/la doyen·ne de l'Assemblée ?",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const [deputesAge, deputesCards] = await Promise.all([
                deputesGateway.getDeputesAgeExtremes(leg),
                deputesGateway.getDeputesCards(leg),
            ]);

            const deputeExtremes = [
                deputesAge.plusJeune && toDeputeCardData(deputesAge.plusJeune, deputesCards, "Le/la plus jeune"),
                deputesAge.plusAge && toDeputeCardData(deputesAge.plusAge, deputesCards, "Le/la doyen·ne"),
            ].filter((c): c is NonNullable<typeof c> => !!c);

            return {
                "depute-age-recit": { legislature: leg, ...deputesAge },
                "card-deputes-age-extremes": { data: { cards: deputeExtremes } },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card" as const, colSpan: 4, config: card("card-deputes-age-extremes") },
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "depute-age-recit",
                render: buildDeputeAgeRecit,
            },
        ],
    },
    {
        id: "age-des-deputes-groupes",
        label: "L'âge moyen par groupe",
        icon: Users,
        description: "La moyenne d'âge des groupes parlementaires n'est pas la même d'un groupe à l'autre.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const [groupesAge, groupesCards] = await Promise.all([
                groupesGateways.getGroupesAge(leg),
                groupesGateways.getGroupesCards(leg),
            ]);
            const tableRows: GroupeAgeTableRow[] = groupesAge.groupes.map((g, i) => ({ ...g, rank: i + 1 }));

            const groupeExtremes = [
                groupesAge.plusJeune && toGroupCardData(groupesAge.plusJeune, groupesCards, "Moyenne d'âge la plus basse"),
                groupesAge.plusAge &&
                groupesAge.plusAge.groupeCode !== groupesAge.plusJeune?.groupeCode &&
                toGroupCardData(groupesAge.plusAge, groupesCards, "Moyenne d'âge la plus élevée"),
            ].filter((c): c is NonNullable<typeof c> => !!c);

            return {
                "groupe-age-recit": { legislature: leg, ...groupesAge },
                "table-age-groupes": tableRows,
                "card-groupes-age-extremes": { data: { cards: groupeExtremes } },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card" as const, colSpan: 4, config: card("card-groupes-age-extremes") },
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "groupe-age-recit",
                render: buildGroupeAgeRecit,
            },
            {
                type: "table" as const,
                colSpan: 4,
                ...table("table-age-groupes"),
                title: "Classement des groupes par âge moyen",
                export: {
                    filenameBase: "age-groupes",
                    csvColumns: [
                        { header: "N°", value: (r) => r.rank },
                        { header: "Groupe", value: (r) => r.groupeLabel },
                        { header: "Âge moyen", value: (r) => `${r.averageAge} ans` },
                    ],
                },
            } satisfies SectionBlock<GroupeAgeTableRow>,
        ],
    },
];
