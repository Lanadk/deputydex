import { Megaphone } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, ParagraphItem, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { GroupCardData } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { card, table, GroupeExpressionTableRow } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";

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

type ExpressionRecitData = {
    legislature: number;
    plusExpressif: GroupeExpressionTableRow | null;
    moinsExpressif: GroupeExpressionTableRow | null;
    plusAbstentionCode: string | null;
    plusAbstentionLabel: string;
    plusAbstentionValue: number;
};

/**
 * Récit dynamique — deux notions bien distinctes à ne pas mélanger :
 * "s'exprimer" (voter pour/contre/abstention plutôt que d'être absent —
 * `groupes.expression-votes`) vs "s'abstenir" (voter une position politique
 * précise, l'abstention — extraite de `groupes.positions-de-vote`, déjà
 * construite pour le thème `positions-de-vote`). Un groupe peut très bien
 * s'exprimer beaucoup ET s'abstenir souvent : les deux mesures ne se
 * contredisent pas.
 */
function buildExpressionRecit(data: BlockDataWrapper | undefined): ParagraphItem[] {
    const dto = data as unknown as ExpressionRecitData | undefined;
    if (!dto || (!dto.plusExpressif && !dto.moinsExpressif)) {
        return [{ type: "text", content: "Données indisponibles pour l'instant." }];
    }

    const items: ParagraphItem[] = [
        { type: "text", content: `Données pour la ${dto.legislature}ᵉ législature, hors scrutins non couverts.` },
    ];

    if (dto.plusExpressif) {
        items.push({
            type: "highlight",
            content: `${dto.plusExpressif.groupeLabel} est le groupe qui s'exprime le plus aux scrutins : ${dto.plusExpressif.tauxExpressionVotes}% de ses positions sont un vote (pour, contre ou abstention) plutôt qu'une absence.`,
        });
    }
    if (dto.moinsExpressif && dto.moinsExpressif.groupeCode !== dto.plusExpressif?.groupeCode) {
        items.push({
            type: "highlight",
            content: `À l'inverse, ${dto.moinsExpressif.groupeLabel} est celui qui s'exprime le moins, avec seulement ${dto.moinsExpressif.tauxExpressionVotes}% de positions exprimées.`,
        });
    }
    if (dto.plusAbstentionCode) {
        items.push({
            type: "text",
            content: `Parmi les positions exprimées, ${dto.plusAbstentionLabel} est le groupe qui s'abstient le plus souvent, dans ${dto.plusAbstentionValue}% des votes.`,
        });
    }

    return items;
}

/**
 * "L'expression des votes" — quels groupes s'expriment le plus aux scrutins
 * (votent plutôt que d'être absents) et lesquels s'abstiennent le plus
 * souvent parmi leurs votes exprimés. Nouvelle stat catalogue
 * `groupes.expression-votes` (scope aggregate, shape distribution, source
 * `agg_groupes_stats_expression_votes`) pour le classement ; réutilise
 * `groupes.positions-de-vote` (déjà construite pour le thème
 * `positions-de-vote`) pour le taux d'abstention — zéro nouveau backend pour
 * cette seconde donnée.
 */
export const EXPRESSION_VOTES_SECTIONS: PageSection[] = [
    {
        id: "expression-votes-classement",
        label: "L'expression des votes",
        icon: Megaphone,
        description: "\"S'exprimer\" veut dire voter une position politique — pour, contre OU abstention, " +
            "peu importe laquelle — plutôt que d'être non-votant (absent, ou volontairement non-votant). " +
            "Le taux d'expression = (votes pour + contre + abstention) / (pour + contre + abstention + non-votants), " +
            "sur l'ensemble des scrutins de la législature. Un groupe peut donc avoir un taux d'expression élevé " +
            "tout en s'abstenant très souvent : voter \"abstention\" compte comme s'exprimer, ce n'est pas la même " +
            "chose que ne pas voter du tout.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const [expressionStat, positionsStat, cards] = await Promise.all([
                statisticsGateway.fetchStat("groupes", "expression-votes", { filters: { legislature: leg } }),
                statisticsGateway.fetchStat("groupes", "positions-de-vote", { filters: { legislature: leg } }),
                groupesGateways.getGroupesCards(leg),
            ]);

            const expressionItems = expressionStat.shape === "distribution" ? expressionStat.items : [];
            const tableRows: GroupeExpressionTableRow[] = expressionItems.map((item, i) => ({
                groupeCode: item.label,
                groupeLabel: cards.find((c) => c.groupeCode === item.label)?.groupeLabel ?? item.label,
                tauxExpressionVotes: item.value,
                rank: i + 1,
            }));

            const plusExpressif = tableRows[0] ?? null;
            const moinsExpressif = tableRows.length > 0 ? tableRows[tableRows.length - 1] : null;

            let plusAbstentionCode: string | null = null;
            let plusAbstentionValue = -1;
            if (positionsStat.shape === "multi-series") {
                for (const s of positionsStat.series) {
                    const abstention = s.items.find((i) => i.label === "Abstention")?.value ?? 0;
                    if (abstention > plusAbstentionValue) {
                        plusAbstentionValue = abstention;
                        plusAbstentionCode = s.name;
                    }
                }
            }
            const plusAbstentionLabel = plusAbstentionCode
                ? (cards.find((c) => c.groupeCode === plusAbstentionCode)?.groupeLabel ?? plusAbstentionCode)
                : "";

            const extremes = [
                plusExpressif && toGroupCardData(plusExpressif.groupeCode, cards, "S'exprime le plus aux scrutins"),
                moinsExpressif && moinsExpressif.groupeCode !== plusExpressif?.groupeCode && toGroupCardData(moinsExpressif.groupeCode, cards, "S'exprime le moins aux scrutins"),
            ].filter((c): c is NonNullable<typeof c> => !!c);

            return {
                "expression-votes-recit": {
                    legislature: leg,
                    plusExpressif,
                    moinsExpressif,
                    plusAbstentionCode,
                    plusAbstentionLabel,
                    plusAbstentionValue: plusAbstentionValue < 0 ? 0 : plusAbstentionValue,
                },
                "table-expression-votes-groupes": tableRows,
                "card-groupes-expression-extremes": { data: { cards: extremes } },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card" as const, colSpan: 4, config: card("card-groupes-expression-extremes") },
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "expression-votes-recit",
                render: buildExpressionRecit,
            },
            {
                type: "table" as const,
                colSpan: 4,
                ...table("table-expression-votes-groupes"),
                title: "Classement des groupes par taux d'expression aux scrutins",
                export: {
                    filenameBase: "expression-votes-groupes",
                    csvColumns: [
                        { header: "N°", value: (r) => r.rank },
                        { header: "Groupe", value: (r) => r.groupeLabel },
                        { header: "Taux d'expression", value: (r) => `${r.tauxExpressionVotes}%` },
                    ],
                },
            } satisfies SectionBlock<GroupeExpressionTableRow>,
        ],
    },
];
