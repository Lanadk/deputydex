import { Vote, Users2 } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, ParagraphItem, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { GroupCardData } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { card, entityChart, table, GroupeCohesionTableRow } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";

function toGroupCardData(code: string, cards: GroupeCardDTO[], caption: string): GroupCardData {
    const found = cards.find((c) => c.groupeCode === code);
    return {
        code,
        libelle: found?.groupeLabel ?? code,
        nbMembers: found?.groupeCountMembers,
        president: found?.groupePresidentFullName,
        sexPresidentType: found?.groupeQualitySexLabel,
        image: found?.groupeImg,
        href: found?.groupeHref ?? `/groupes/${code}`,
        caption,
    };
}

type CohesionRecitData = {
    legislature: number;
    plusCohesif: GroupeCohesionTableRow | null;
    moinsCohesif: GroupeCohesionTableRow | null;
};

/**
 * Récit dynamique — deux extrêmes du même classement : le groupe le plus
 * "uni" (ses membres votent le plus souvent ensemble) et le moins uni.
 */
function buildCohesionRecit(data: BlockDataWrapper | undefined): ParagraphItem[] {
    const dto = data as unknown as CohesionRecitData | undefined;
    if (!dto || (!dto.plusCohesif && !dto.moinsCohesif)) {
        return [{ type: "text", content: "Données indisponibles pour l'instant." }];
    }

    const items: ParagraphItem[] = [
        {
            type: "text",
            content: `Données pour la ${dto.legislature}ᵉ législature — la cohésion mesure la part des votes d'un scrutin où un·e député·e a voté dans le même sens que la position majoritaire de son groupe (pour, contre ou abstention), sur les scrutins où au moins 5 membres du groupe ont voté. Donnée encore en cours de validation côté source.`,
        },
    ];

    if (dto.plusCohesif) {
        items.push({
            type: "highlight",
            content: `${dto.plusCohesif.groupeLabel} est le groupe le plus uni, avec ${dto.plusCohesif.tauxCohesion}% de votes alignés sur la position majoritaire du groupe.`,
        });
    }
    if (dto.moinsCohesif && dto.moinsCohesif.groupeCode !== dto.plusCohesif?.groupeCode) {
        items.push({
            type: "text",
            content: `À l'inverse, ${dto.moinsCohesif.groupeLabel} est celui où les membres s'écartent le plus souvent de la ligne du groupe, avec seulement ${dto.moinsCohesif.tauxCohesion}% de votes alignés.`,
        });
    }

    return items;
}

/**
 * "La cohésion des groupes" — à quel point les membres d'un même groupe
 * votent-ils ensemble. Deux nouvelles stats catalogue :
 * `groupes.cohesion-legislature` (scope aggregate, shape distribution,
 * source `agg_groupes_stats_cohesion_legislature`) pour le classement, et
 * `groupes.cohesion-evolution-groupes` (scope aggregate, shape multi-series,
 * source `agg_groupes_stats_cohesion_mensuelle`) pour l'évolution superposée
 * par groupe — même principe que `participation-presence.sections.ts`.
 *
 * IMPORTANT : les deux vues source sont encore marquées "PAS ENCORE VALIDE"
 * côté deputydex-data (même statut que `agg_groupes_stats_stabilite`, qui a
 * fait exclure le thème `stabilite-groupes`) — construit quand même à la
 * demande explicite, en attendant une validation conjointe avec l'équipe
 * data. Ne pas retirer cet avertissement avant que la vue source elle-même
 * porte "OK VALIDE".
 */
export const COHESION_GROUPES_SECTIONS: PageSection[] = [
    {
        id: "cohesion-groupes-classement",
        label: "Quels groupes votent le plus soudés",
        icon: Vote,
        description: "La cohésion mesure la part des votes d'un·e député·e alignés avec la position majoritaire " +
            "de son groupe (pour, contre ou abstention), sur les scrutins où le groupe a suffisamment voté pour " +
            "que le calcul soit fiable. Donnée encore en cours de validation côté source — à prendre avec " +
            "précaution en attendant confirmation de la méthodologie.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const [stat, cards] = await Promise.all([
                statisticsGateway.fetchStat("groupes", "cohesion-legislature", { filters: { legislature: leg } }),
                groupesGateways.getGroupesCards(leg),
            ]);
            const items = stat.shape === "distribution" ? stat.items : [];

            const tableRows: GroupeCohesionTableRow[] = items.map((item, i) => ({
                groupeCode: item.label,
                groupeLabel: cards.find((c) => c.groupeCode === item.label)?.groupeLabel ?? item.label,
                tauxCohesion: item.value,
                rank: i + 1,
            }));

            const plusCohesif = tableRows[0] ?? null;
            const moinsCohesif = tableRows.length > 0 ? tableRows[tableRows.length - 1] : null;

            const extremes = [
                plusCohesif && toGroupCardData(plusCohesif.groupeCode, cards, "Le plus uni"),
                moinsCohesif && moinsCohesif.groupeCode !== plusCohesif?.groupeCode && toGroupCardData(moinsCohesif.groupeCode, cards, "Le moins uni"),
            ].filter((c): c is NonNullable<typeof c> => !!c);

            return {
                "cohesion-recit": { legislature: leg, plusCohesif, moinsCohesif },
                "table-cohesion-groupes": tableRows,
                "card-groupes-cohesion-extremes": { data: { cards: extremes } },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card" as const, colSpan: 4, config: card("card-groupes-cohesion-extremes") },
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "cohesion-recit",
                render: buildCohesionRecit,
            },
            {
                type: "table" as const,
                colSpan: 4,
                ...table("table-cohesion-groupes"),
                title: "Classement des groupes par taux de cohésion",
                export: {
                    filenameBase: "cohesion-groupes",
                    csvColumns: [
                        { header: "N°", value: (r) => r.rank },
                        { header: "Groupe", value: (r) => r.groupeLabel },
                        { header: "Taux de cohésion", value: (r) => `${r.tauxCohesion}%` },
                    ],
                },
            } satisfies SectionBlock<GroupeCohesionTableRow>,
        ],
    },
    {
        id: "cohesion-groupes-evolution",
        label: "Comment ça évolue, groupe par groupe",
        icon: Users2,
        description: "Tous les groupes sont superposés par défaut — cliquez un groupe pour retirer ou remettre " +
            "sa courbe à la volée, y compris les groupes renommés ou dissous en cours de législature " +
            "(ex: SOC-NUPES → SOC en 16ᵉ législature), chacun avec sa propre période.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const groupes = await groupesGateways.getGroupesList(leg);

            return {
                "entity-chart-cohesion-groupe": { entities: groupes.map((g) => ({ code: g.code, label: g.label })) },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "entity-chart" as const, colSpan: 4, config: entityChart("entity-chart-cohesion-groupe") },
        ],
    },
];
