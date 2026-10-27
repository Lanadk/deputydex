import { History } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, ParagraphItem, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { GroupCardData } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { card, table, GroupeCumulMandatsTableRow } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";

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

type CumulMandatsRecitData = {
    legislature: number;
    plusAncien: GroupeCumulMandatsTableRow | null;
    moinsAncien: GroupeCumulMandatsTableRow | null;
};

/**
 * Récit dynamique — même précaution de vocabulaire que l'âge
 * (`age-des-deputes.sections.ts`) : un groupe n'est pas "ancien", ce sont ses
 * membres qui ont, en moyenne, plus ou moins d'années de siège derrière eux.
 */
function buildCumulMandatsRecit(data: BlockDataWrapper | undefined): ParagraphItem[] {
    const dto = data as unknown as CumulMandatsRecitData | undefined;
    if (!dto || (!dto.plusAncien && !dto.moinsAncien)) {
        return [{ type: "text", content: "Données indisponibles pour l'instant." }];
    }

    const items: ParagraphItem[] = [
        {
            type: "text",
            content: `Données pour la ${dto.legislature}ᵉ législature — l'ancienneté d'un·e député·e est le nombre d'années cumulées passées à siéger à l'Assemblée, toutes législatures confondues, puis moyennée sur les membres actuels de chaque groupe.`,
        },
    ];

    if (dto.plusAncien) {
        items.push({
            type: "highlight",
            content: `C'est chez ${dto.plusAncien.groupeLabel} que les membres siègent depuis le plus longtemps, avec ${dto.plusAncien.averageCumulatedYears} ans d'ancienneté en moyenne.`,
        });
    }
    if (dto.moinsAncien && dto.moinsAncien.groupeCode !== dto.plusAncien?.groupeCode) {
        items.push({
            type: "text",
            content: `À l'inverse, ${dto.moinsAncien.groupeLabel} compte les membres les plus récemment arrivés, avec ${dto.moinsAncien.averageCumulatedYears} ans d'ancienneté en moyenne.`,
        });
    }

    return items;
}

/**
 * "Le cumul des mandats" — volet 1 : ancienneté moyenne par groupe. Nouvelle
 * stat catalogue `groupes.cumul-mandats` (scope aggregate, shape
 * distribution, source `agg_groupes_stats_cumul_mandats`), même gabarit que
 * `cohesion-groupes.sections.ts` (cards d'extrêmes + récit + table).
 *
 * La vue source somme la durée des mandats de type GP (appartenance à un
 * groupe) de chaque membre — c'est une ancienneté en années de siège,
 * bornée par la profondeur historique des législatures chargées en base,
 * pas un nombre de mandats de député (voir
 * `IGroupesStatsRepository.getCumulMandatsParGroupe`). Le volet 2 ("qui
 * cumule le plus de mandats", à titre individuel) n'a pas encore de vue
 * source côté deputydex-data.
 */
export const CUMUL_MANDATS_SECTIONS: PageSection[] = [
    {
        id: "cumul-mandats-groupes",
        label: "L'ancienneté moyenne par groupe",
        icon: History,
        description: "Depuis combien d'années les membres de chaque groupe siègent-ils à l'Assemblée ? " +
            "Moyenne calculée sur les membres actuels du groupe, à partir de toutes les législatures " +
            "présentes dans nos données.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const [stat, cards] = await Promise.all([
                statisticsGateway.fetchStat("groupes", "cumul-mandats", { filters: { legislature: leg } }),
                groupesGateways.getGroupesCards(leg),
            ]);
            const items = stat.shape === "distribution" ? stat.items : [];

            const tableRows: GroupeCumulMandatsTableRow[] = items.map((item, i) => ({
                groupeCode: item.label,
                groupeLabel: cards.find((c) => c.groupeCode === item.label)?.groupeLabel ?? item.label,
                averageCumulatedYears: item.value,
                rank: i + 1,
            }));

            const plusAncien = tableRows[0] ?? null;
            const moinsAncien = tableRows.length > 0 ? tableRows[tableRows.length - 1] : null;

            const extremes = [
                plusAncien && toGroupCardData(plusAncien.groupeCode, cards, "Ancienneté moyenne la plus élevée"),
                moinsAncien && moinsAncien.groupeCode !== plusAncien?.groupeCode && toGroupCardData(moinsAncien.groupeCode, cards, "Ancienneté moyenne la plus basse"),
            ].filter((c): c is NonNullable<typeof c> => !!c);

            return {
                "cumul-mandats-recit": { legislature: leg, plusAncien, moinsAncien },
                "table-cumul-mandats-groupes": tableRows,
                "card-groupes-cumul-mandats-extremes": { data: { cards: extremes } },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card" as const, colSpan: 4, config: card("card-groupes-cumul-mandats-extremes") },
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "cumul-mandats-recit",
                render: buildCumulMandatsRecit,
            },
            {
                type: "table" as const,
                colSpan: 4,
                ...table("table-cumul-mandats-groupes"),
                title: "Classement des groupes par ancienneté moyenne",
                export: {
                    filenameBase: "anciennete-groupes",
                    csvColumns: [
                        { header: "N°", value: (r) => r.rank },
                        { header: "Groupe", value: (r) => r.groupeLabel },
                        { header: "Ancienneté moyenne", value: (r) => `${r.averageCumulatedYears} ans` },
                    ],
                },
            } satisfies SectionBlock<GroupeCumulMandatsTableRow>,
        ],
    },
];
