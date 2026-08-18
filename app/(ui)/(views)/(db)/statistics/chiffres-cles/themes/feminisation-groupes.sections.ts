import { Users } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, ParagraphItem, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { GroupCardData } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { GroupeFeminisationRowDTO, GroupesFeminisationDTO } from "@/app/domains/groupes/dto/groupes-feminisation.dto";
import { card, table, GroupeFeminisationTableRow } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";

/**
 * `GroupeFeminisationRowDTO` (parité) n'a ni président, ni photo, ni couleur
 * — seul `getGroupesCards` (déjà utilisé par la page /groupes et les
 * EntityResolver de Statistiques) les a. On croise les deux par code plutôt
 * que d'aller chercher ces infos côté `getGroupesFeminisation` : zéro nouveau
 * backend, juste un second fetch en parallèle.
 */
function toGroupCardData(row: GroupeFeminisationRowDTO, cards: GroupeCardDTO[], caption: string): GroupCardData {
    const found = cards.find((c) => c.groupeCode === row.groupeCode);
    return {
        code: row.groupeCode,
        libelle: row.groupeLabel,
        nbMembers: row.nbTotal,
        president: found?.groupePresidentFullName,
        sexPresidentType: found?.groupeQualitySexLabel,
        image: found?.groupeImg,
        href: found?.groupeHref ?? `/groupes/${row.groupeCode}`,
        caption,
    };
}

type FeminisationRecitData = GroupesFeminisationDTO & { legislature: number };

/**
 * Transforme le DTO en phrases — "récit" dynamique généré depuis les
 * vraies données (voir `ParagraphSource` dans block-section-renderer.tsx),
 * pas un texte figé. Toujours au moins une phrase (fallback si aucun
 * mouvement de femme n'a eu lieu, plutôt qu'un bloc vide).
 */
function buildFeminisationRecit(data: BlockDataWrapper | undefined): ParagraphItem[] {
    const dto = data as unknown as FeminisationRecitData | undefined;
    if (!dto || dto.groupes.length === 0) return [{ type: "text", content: "Données indisponibles pour l'instant." }];

    // Toujours en premier : sur quelle législature portent ces chiffres —
    // sans ça, un chiffre isolé ne dit jamais s'il date d'aujourd'hui ou
    // d'une législature passée (voir StatViewer.contextLabel, même principe).
    const items: ParagraphItem[] = [
        { type: "text", content: `Données pour la ${dto.legislature}ᵉ législature.` },
    ];

    // Deux sujets bien distincts mélangés dans une même liste de phrases se
    // lisaient mal (rien ne signale le changement de sujet) — un sous-titre
    // par thème sépare clairement "à quel point chaque groupe est féminisé
    // aujourd'hui" de "comment sa composition a bougé depuis le début".
    const feminisation: ParagraphItem[] = [];
    if (dto.plusFeminise) {
        feminisation.push({
            type: "highlight",
            content:
                `Le groupe le plus féminisé est ${dto.plusFeminise.groupeLabel}, avec ${dto.plusFeminise.pctFemmes}% ` +
                `de femmes (${dto.plusFeminise.nbFemmes} sur ${dto.plusFeminise.nbTotal} membres).`,
        });
    }
    if (dto.moinsFeminise && dto.moinsFeminise.groupeCode !== dto.plusFeminise?.groupeCode) {
        feminisation.push({
            type: "highlight",
            content:
                `À l'inverse, ${dto.moinsFeminise.groupeLabel} est le moins féminisé, avec seulement ` +
                `${dto.moinsFeminise.pctFemmes}% de femmes (${dto.moinsFeminise.nbFemmes} sur ${dto.moinsFeminise.nbTotal}).`,
        });
    }
    if (feminisation.length > 0) {
        items.push({ type: "subheading", content: "Taux de féminisation" }, ...feminisation);
    }

    const mouvements: ParagraphItem[] = [];
    if (dto.plusDeFemmesIntegrees) {
        mouvements.push({
            type: "text",
            content:
                `Depuis le début de la législature, c'est ${dto.plusDeFemmesIntegrees.groupeLabel} qui a intégré le ` +
                `plus de nouvelles députées (${dto.plusDeFemmesIntegrees.femmesArrivees}).`,
        });
    }
    if (dto.plusDeFemmesParties) {
        mouvements.push({
            type: "text",
            content:
                `À l'inverse, ${dto.plusDeFemmesParties.groupeLabel} est le groupe qui en a perdu le plus ` +
                `(${dto.plusDeFemmesParties.femmesParties}).`,
        });
    }
    if (mouvements.length > 0) {
        items.push({ type: "subheading", content: "Mouvements de femmes (turnover)" }, ...mouvements);
    }

    if (items.length === 1) {
        // Rien au-delà de la ligne "Données pour la Xᵉ législature" — aucun
        // extrême calculable (pas de groupes, ou aucun mouvement de femme).
        items.push({ type: "text", content: "Pas assez de mouvements pour dégager une tendance sur cette législature." });
    }

    return items;
}

/**
 * "La féminisation des groupes politiques" — classement de tous les groupes
 * par taux de féminisation, + récit généré ("le plus/moins féminisé",
 * "celui qui a le plus intégré/perdu de femmes"). "Non inscrits" exclu :
 * pas un groupe politique — voir la méthodologie dans
 * `prisma-groupes-stats.repository.ts` (`getPariteParGroupe` /
 * `getFeminisationMouvements`) pour la définition précise d'"intégrée"/"partie".
 */
export const FEMINISATION_GROUPES_SECTIONS: PageSection[] = [
    {
        id: "feminisation-groupes-classement",
        label: "La féminisation des groupes politiques",
        icon: Users,
        description: "Tous les groupes politiques ne sont pas également féminisés — et ça évolue au fil de la " +
            "législature. Taux de féminisation = nombre de femmes / effectif total du groupe × 100, Non inscrits " +
            "exclus (ce n'est pas un groupe politique). \"Intégrée\" = une députée ayant rejoint le groupe après " +
            "sa formation initiale en début de législature ; \"partie\" = une députée dont la date de fin " +
            "d'appartenance au groupe est renseignée (démission du groupe, fin de mandat...).",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const [dto, cards] = await Promise.all([
                groupesGateways.getGroupesFeminisation(leg),
                groupesGateways.getGroupesCards(leg),
            ]);
            const tableRows: GroupeFeminisationTableRow[] = dto.groupes.map((g, i) => ({ ...g, rank: i + 1 }));

            // `dto` (récit) n'a pas la forme d'un ChartDataWrapper/CardDataWrapper — même
            // pattern que groupes/[code]/config.ts pour un dataMap hétérogène.
            const extremes = [
                dto.plusFeminise && toGroupCardData(dto.plusFeminise, cards, "Le plus féminisé"),
                dto.moinsFeminise &&
                    dto.moinsFeminise.groupeCode !== dto.plusFeminise?.groupeCode &&
                    toGroupCardData(dto.moinsFeminise, cards, "Le moins féminisé"),
            ].filter((c): c is NonNullable<typeof c> => !!c);

            return {
                "feminisation-recit": { ...dto, legislature: leg },
                "table-feminisation-groupes": tableRows,
                "card-groupes-feminisation-extremes": { data: { cards: extremes } },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card" as const, colSpan: 4, config: card("card-groupes-feminisation-extremes") },
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "feminisation-recit",
                render: buildFeminisationRecit,
            },
            {
                type: "table" as const,
                colSpan: 4,
                ...table("table-feminisation-groupes"),
                title: "Classement des groupes par taux de féminisation",
                export: {
                    filenameBase: "feminisation-groupes",
                    csvColumns: [
                        { header: "N°", value: (r) => r.rank },
                        { header: "Groupe", value: (r) => r.groupeLabel },
                        { header: "Taux de féminisation", value: (r) => `${r.pctFemmes}%` },
                        { header: "Nombre de femmes", value: (r) => r.nbFemmes },
                        { header: "Effectif du groupe", value: (r) => r.nbTotal },
                    ],
                },
            } satisfies SectionBlock<GroupeFeminisationTableRow>,
        ],
    },
];
