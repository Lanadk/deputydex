import { Vote, TrendingUp, Users2 } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, ParagraphItem, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { GroupCardData } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { statisticsGateway } from "@/app/(ui)/gateways/statistics/statistics.gateway";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { card, chart, entityChart, table, GroupeParticipationTableRow } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";

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

type ParticipationRecitData = {
    legislature: number;
    plusAssidu: GroupeParticipationTableRow | null;
    /** Groupe le moins assidu = mathématiquement aussi le plus absent (complément exact) — un seul champ, pas deux rangs distincts à calculer. */
    moinsAssidu: GroupeParticipationTableRow | null;
};

/**
 * Récit dynamique — deux angles complémentaires du même chiffre :
 * "participation" (le groupe vote effectivement) et "présence"/absence (son
 * complément exact, 100 - participation — pas une donnée distincte, un
 * scrutin éligible est soit voté soit non-votant). "Participation" ici =
 * scrutins où le groupe/député était éligible à voter ET a effectivement
 * pris position (pour/contre/abstention), pas juste "était présent dans
 * l'hémicycle" — voir la méthodologie de `agg_groupes_stats_participation_legislature`
 * côté deputydex-data (moyenne pondérée par les scrutins éligibles).
 */
function buildParticipationRecit(data: BlockDataWrapper | undefined): ParagraphItem[] {
    const dto = data as unknown as ParticipationRecitData | undefined;
    if (!dto || (!dto.plusAssidu && !dto.moinsAssidu)) {
        return [{ type: "text", content: "Données indisponibles pour l'instant." }];
    }

    const items: ParagraphItem[] = [
        { type: "text", content: `Données pour la ${dto.legislature}ᵉ législature — participation = scrutins effectivement votés (pour, contre ou abstention) parmi ceux où le groupe était éligible ; absence = le complément, scrutins éligibles mais non-votants.` },
    ];

    if (dto.plusAssidu) {
        items.push({
            type: "highlight",
            content: `${dto.plusAssidu.groupeLabel} est le groupe le plus assidu, avec ${dto.plusAssidu.tauxParticipation}% de scrutins effectivement votés (${dto.plusAssidu.tauxAbsence}% d'absence).`,
        });
    }
    if (dto.moinsAssidu && dto.moinsAssidu.groupeCode !== dto.plusAssidu?.groupeCode) {
        items.push({
            type: "text",
            content: `À l'inverse, ${dto.moinsAssidu.groupeLabel} est le groupe le moins assidu — et donc le plus souvent absent — avec seulement ${dto.moinsAssidu.tauxParticipation}% de participation (${dto.moinsAssidu.tauxAbsence}% d'absence).`,
        });
    }

    return items;
}

/**
 * "Participation & présence" — trois sections :
 * - le classement des groupes par assiduité sur la législature en cours
 *   (nouvelle stat catalogue `groupes.participation`, scope aggregate,
 *   source `agg_groupes_stats_participation_legislature`, OK VALIDE) ;
 * - l'évolution mensuelle du taux de participation, TOUS GROUPES ET TOUTES
 *   LÉGISLATURES CONFONDUS (réutilise `scrutins.participation`, déjà
 *   exposée pour le mode Statistiques avancées — cette stat est une moyenne
 *   globale, pas filtrée par législature ni par groupe, volontairement :
 *   elle raconte une tendance de long terme, pas un instantané, même
 *   logique que `legislatures.parite` dans `femmes-assemblee.sections.ts`) ;
 * - l'évolution mensuelle PAR GROUPE, tous superposés par défaut, chaque
 *   groupe retirable/remettable à la volée en cliquant son bouton (nouveau
 *   block `entity-chart` — voir `block-entity-chart-renderer.tsx` — un seul
 *   fetch de `groupes.participation-evolution-groupes` (scope aggregate,
 *   multi-series), filtré côté client, jamais de nouvelle requête au clic).
 *   La liste de groupes vient de `groupesGateways.getGroupesList` (PAS
 *   `getGroupesCards`) : Non inscrits et groupes à 0 membre courant INCLUS
 *   volontairement — un groupe renommé/dissous en cours de législature
 *   (ex: SOC-NUPES → SOC en 16ᵉ) a bien eu une activité de vote pendant
 *   qu'il existait, même si son effectif courant est retombé à 0.
 */
export const PARTICIPATION_PRESENCE_SECTIONS: PageSection[] = [
    {
        id: "participation-presence-classement",
        label: "Qui participe le plus aux scrutins — et qui est le plus absent",
        icon: Vote,
        description: "Être éligible à voter ne veut pas dire voter : certains groupes transforment beaucoup plus souvent cette éligibilité en position exprimée que d'autres — et à l'inverse, sont absents (non-votants) beaucoup moins souvent.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const [stat, cards] = await Promise.all([
                statisticsGateway.fetchStat("groupes", "participation", { filters: { legislature: leg } }),
                groupesGateways.getGroupesCards(leg),
            ]);
            const items = stat.shape === "distribution" ? stat.items : [];

            const tableRows: GroupeParticipationTableRow[] = items.map((item, i) => ({
                groupeCode: item.label,
                groupeLabel: cards.find((c) => c.groupeCode === item.label)?.groupeLabel ?? item.label,
                tauxParticipation: item.value,
                tauxAbsence: Math.round((100 - item.value) * 10) / 10,
                rank: i + 1,
            }));

            const plusAssidu = tableRows[0] ?? null;
            const moinsAssidu = tableRows.length > 0 ? tableRows[tableRows.length - 1] : null;

            const extremes = [
                plusAssidu && toGroupCardData(plusAssidu.groupeCode, cards, "Le plus assidu"),
                moinsAssidu && moinsAssidu.groupeCode !== plusAssidu?.groupeCode && toGroupCardData(moinsAssidu.groupeCode, cards, "Le moins assidu"),
            ].filter((c): c is NonNullable<typeof c> => !!c);

            return {
                "participation-recit": { legislature: leg, plusAssidu, moinsAssidu },
                "table-participation-groupes": tableRows,
                "card-groupes-participation-extremes": { data: { cards: extremes } },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card" as const, colSpan: 4, config: card("card-groupes-participation-extremes") },
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "participation-recit",
                render: buildParticipationRecit,
            },
            {
                type: "table" as const,
                colSpan: 4,
                ...table("table-participation-groupes"),
                title: "Classement des groupes par taux de participation",
                export: {
                    filenameBase: "participation-presence-groupes",
                    csvColumns: [
                        { header: "N°", value: (r) => r.rank },
                        { header: "Groupe", value: (r) => r.groupeLabel },
                        { header: "Taux de participation", value: (r) => `${r.tauxParticipation}%` },
                        { header: "Taux d'absence", value: (r) => `${r.tauxAbsence}%` },
                    ],
                },
            } satisfies SectionBlock<GroupeParticipationTableRow>,
        ],
    },
    {
        id: "participation-presence-evolution",
        label: "Comment ça évolue, tous groupes confondus",
        icon: TrendingUp,
        description: "Le taux de participation aux scrutins n'est pas figé — il varie au fil des mois, et d'une législature à l'autre. Vue d'ensemble ici : la moyenne de l'Assemblée entière, tous groupes et toutes législatures confondus (le détail par groupe est juste en dessous).",
        cols: 4,
        lazy: false,
        gatewayFn: async () => {
            const stat = await statisticsGateway.fetchStat("scrutins", "participation", {});
            const points = stat.shape === "timeseries" ? stat.points : [];

            return {
                "chart-participation-evolution-assemblee": { data: points },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "chart" as const, colSpan: 4, config: chart("chart-participation-evolution-assemblee") },
        ],
    },
    {
        id: "participation-presence-evolution-groupe",
        label: "Comment ça évolue, groupe par groupe",
        icon: Users2,
        description: "Tous les groupes sont superposés par défaut — cliquez un groupe pour retirer ou remettre sa courbe à la volée, y compris les groupes renommés ou dissous en cours de législature (ex: SOC-NUPES → SOC en 16ᵉ législature), chacun avec sa propre période.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const groupes = await groupesGateways.getGroupesList(leg);

            return {
                "entity-chart-participation-groupe": { entities: groupes.map((g) => ({ code: g.code, label: g.label })) },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "entity-chart" as const, colSpan: 4, config: entityChart("entity-chart-participation-groupe") },
        ],
    },
];
