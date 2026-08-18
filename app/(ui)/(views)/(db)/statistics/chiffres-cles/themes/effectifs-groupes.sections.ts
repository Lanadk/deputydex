import { UsersRound } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, ParagraphItem, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { GroupCardData } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { card, table, GroupeEffectifTableRow } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";

function toGroupCardData(row: GroupeCardDTO, caption: string): GroupCardData {
    return {
        code: row.groupeCode,
        libelle: row.groupeLabel,
        nbMembers: row.groupeCountMembers,
        president: row.groupePresidentFullName,
        sexPresidentType: row.groupeQualitySexLabel,
        image: row.groupeImg,
        href: row.groupeHref,
        caption,
    };
}

type EffectifsRecitData = { legislature: number; plusGrand: GroupeCardDTO | null; plusPetit: GroupeCardDTO | null };

/**
 * Récit dynamique — pas de notion de turnover ici (contrairement au teaser
 * initial du thème dans `themes.registry.ts`, volontairement recentré) : la
 * vue source (`agg_groupes_stats_stabilite`, "combien de député·es sont
 * passé·es par un groupe") est encore marquée `PAS ENCORE VALIDE` côté
 * deputydex-data — on ne construit pas dessus tant qu'elle n'est pas
 * validée. Cette section ne montre que l'effectif actuel, seule donnée
 * fiable disponible (`agg_groupes_effectifs_legislature`, déjà utilisée par
 * `groupes.effectifs` en mode Statistiques avancées).
 */
function buildEffectifsRecit(data: BlockDataWrapper | undefined): ParagraphItem[] {
    const dto = data as unknown as EffectifsRecitData | undefined;
    if (!dto || (!dto.plusGrand && !dto.plusPetit)) return [{ type: "text", content: "Données indisponibles pour l'instant." }];

    const items: ParagraphItem[] = [
        { type: "text", content: `Données pour la ${dto.legislature}ᵉ législature.` },
    ];

    if (dto.plusGrand) {
        items.push({
            type: "highlight",
            content: `${dto.plusGrand.groupeLabel} est le groupe le plus nombreux, avec ${dto.plusGrand.groupeCountMembers} député·es.`,
        });
    }
    if (dto.plusPetit && dto.plusPetit.groupeCode !== dto.plusGrand?.groupeCode) {
        items.push({
            type: "highlight",
            content: `À l'inverse, ${dto.plusPetit.groupeLabel} est le plus petit groupe, avec seulement ${dto.plusPetit.groupeCountMembers} député·es.`,
        });
    }

    return items;
}

/**
 * "La taille des groupes parlementaires" — classement des groupes par
 * effectif actuel. Zéro nouveau backend : `groupesGateways.getGroupesCards`
 * (déjà consommé par `age-des-deputes`/`feminisation-groupes.sections.ts`)
 * porte déjà `groupeCountMembers` par groupe — ne filtre plus que le groupe
 * "NI (groupe technique)" (`TBD`/`PO0`, voir prisma-groupes-cards.repository.ts) ;
 * les VRAIS Non inscrits (NI-16/NI-17) y sont désormais inclus, comme
 * n'importe quel autre groupe ayant un effectif. Pas besoin de repasser par
 * `statisticsGateway.fetchStat`.
 */
export const EFFECTIFS_GROUPES_SECTIONS: PageSection[] = [
    {
        id: "effectifs-groupes-classement",
        label: "La taille des groupes parlementaires",
        icon: UsersRound,
        description: "Les groupes politiques n'ont pas tous le même poids à l'Assemblée — certains rassemblent " +
            "plusieurs dizaines de député·es, d'autres à peine une poignée. Effectif = nombre de député·es " +
            "actuellement recensés dans le groupe ; les groupes renommés ou dissous en cours de législature " +
            "(dont l'effectif actuel est retombé à 0) n'apparaissent pas dans ce classement.",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const cards = await groupesGateways.getGroupesCards(leg);
            // `getGroupesCards` remonte aussi les groupes qui ont existé sur
            // la législature mais ont depuis été renommés/dissous (ex: UDR →
            // UDDPR après renommage, tous ses membres ont basculé vers le
            // nouveau code) — nb_acteurs_photo retombe à 0 pour ces
            // groupes-fantômes plutôt que de disparaître (voir le TODO dans
            // prisma-groupes-cards.repository.ts). Un classement de taille
            // n'a de sens que pour des groupes qui existent encore.
            const withMembers = cards.filter((c) => c.groupeCountMembers > 0);
            const sorted = [...withMembers].sort((a, b) => b.groupeCountMembers - a.groupeCountMembers);
            // Le classement COMPLET (table + export) garde les VRAIS Non
            // inscrits — ils ont un effectif réel, pas de raison de les
            // cacher de la liste.
            const tableRows: GroupeEffectifTableRow[] = sorted.map((g, i) => ({ ...g, rank: i + 1 }));

            // Les deux CARTES "extrêmes" (et la phrase du récit), en
            // revanche, ne doivent jamais désigner les Non inscrits comme
            // "le plus grand"/"le plus petit groupe" : ce n'est pas un
            // groupe politique organisé, juste un rattachement administratif
            // pour les député·es sans groupe — même raison que partout
            // ailleurs (parité, âge, cohésion...) où NI est exclu des
            // comparaisons de poids politique. Donc "le plus petit groupe"
            // ici est le plus petit groupe POLITIQUE, pas forcément le
            // dernier de `sorted` si un NI s'y trouve.
            const political = sorted.filter((c) => !c.groupeCode.startsWith("NI"));
            const plusGrand = political[0] ?? null;
            const plusPetit = political.length > 0 ? political[political.length - 1] : null;

            const extremes = [
                plusGrand && toGroupCardData(plusGrand, "Le plus grand groupe"),
                plusPetit && plusPetit.groupeCode !== plusGrand?.groupeCode && toGroupCardData(plusPetit, "Le plus petit groupe"),
            ].filter((c): c is NonNullable<typeof c> => !!c);

            return {
                "effectifs-recit": { legislature: leg, plusGrand, plusPetit },
                "table-effectifs-groupes": tableRows,
                "card-groupes-effectifs-extremes": { data: { cards: extremes } },
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card" as const, colSpan: 4, config: card("card-groupes-effectifs-extremes") },
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "effectifs-recit",
                render: buildEffectifsRecit,
            },
            {
                type: "table" as const,
                colSpan: 4,
                ...table("table-effectifs-groupes"),
                title: "Classement des groupes par effectif",
                export: {
                    filenameBase: "effectifs-groupes",
                    csvColumns: [
                        { header: "N°", value: (r) => r.rank },
                        { header: "Groupe", value: (r) => r.groupeLabel },
                        { header: "Effectif", value: (r) => r.groupeCountMembers },
                    ],
                },
            } satisfies SectionBlock<GroupeEffectifTableRow>,
        ],
    },
];
