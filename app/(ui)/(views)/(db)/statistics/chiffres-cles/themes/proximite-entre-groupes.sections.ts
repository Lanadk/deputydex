import { Landmark, Network } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { BlockDataWrapper, ParagraphItem, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { GroupCardData } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";
import { GroupeProximitePaireDTO, GroupesProximiteDTO } from "@/app/domains/groupes/dto/groupes-proximite.dto";
import {
    card,
    table,
    GroupeProximiteGouvernementTableRow,
    GroupeProximitePaireTableRow,
} from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/registry";

function toGroupCardData(code: string, label: string, cards: GroupeCardDTO[], caption: string): GroupCardData {
    const found = cards.find((c) => c.groupeCode === code);
    return {
        code,
        libelle: found?.groupeLabel ?? label,
        nbMembers: found?.groupeCountMembers,
        president: found?.groupePresidentFullName,
        sexPresidentType: found?.groupeQualitySexLabel,
        image: found?.groupeImg,
        href: found?.groupeHref ?? `/groupes/${code}`,
        caption,
    };
}

/** Les deux groupes d'une paire, côte à côte, avec la même légende — un seul `group-card-pair` par paire. */
function toPaireCards(paire: GroupeProximitePaireDTO | null, cards: GroupeCardDTO[], caption: string): { data: { cards: GroupCardData[] } } {
    if (!paire) return { data: { cards: [] } };
    return {
        data: {
            cards: [
                toGroupCardData(paire.groupeACode, paire.groupeALabel, cards, caption),
                toGroupCardData(paire.groupeBCode, paire.groupeBLabel, cards, caption),
            ],
        },
    };
}

/** Comparaison par codes, pas par référence : `plusProches`/`plusEloignes` arrivent du JSON comme deux objets distincts même quand c'est la même paire (une seule paire en base). */
function isSamePaire(a: GroupeProximitePaireDTO | null, b: GroupeProximitePaireDTO | null): boolean {
    return !!a && !!b && a.groupeACode === b.groupeACode && a.groupeBCode === b.groupeBCode;
}

type ProximiteRecitData = { legislature: number } & GroupesProximiteDTO;

function buildPairesRecit(data: BlockDataWrapper | undefined): ParagraphItem[] {
    const dto = data as unknown as ProximiteRecitData | undefined;
    if (!dto || dto.paires.length === 0) {
        return [{ type: "text", content: "Données indisponibles pour l'instant." }];
    }

    const items: ParagraphItem[] = [
        {
            type: "text",
            content: `Données pour la ${dto.legislature}ᵉ législature — pour chaque paire de groupes, on compare la position majoritaire de chacun (pour, contre ou abstention) sur les scrutins où les deux se sont exprimés, et on mesure la part de ces scrutins où elles sont identiques.`,
        },
    ];

    if (dto.plusProches) {
        items.push({
            type: "highlight",
            content: `${dto.plusProches.groupeALabel} et ${dto.plusProches.groupeBLabel} sont les deux groupes qui votent le plus souvent dans le même sens : ${dto.plusProches.tauxProximite}% de positions identiques.`,
        });
    }
    if (dto.plusEloignes && !isSamePaire(dto.plusEloignes, dto.plusProches)) {
        items.push({
            type: "text",
            content: `À l'opposé, ${dto.plusEloignes.groupeALabel} et ${dto.plusEloignes.groupeBLabel} ne se retrouvent que sur ${dto.plusEloignes.tauxProximite}% des scrutins comparés.`,
        });
    }

    return items;
}

function buildGouvernementRecit(data: BlockDataWrapper | undefined): ParagraphItem[] {
    const dto = data as unknown as ProximiteRecitData | undefined;
    if (!dto) return [{ type: "text", content: "Données indisponibles pour l'instant." }];
    if (!dto.gouvernementReference) {
        return [{ type: "text", content: `Pas de groupe de référence du gouvernement défini pour la ${dto.legislature}ᵉ législature.` }];
    }
    if (dto.proximiteGouvernement.length === 0) {
        return [{ type: "text", content: "Données indisponibles pour l'instant." }];
    }

    const ref = dto.gouvernementReference;
    const plusProche = dto.proximiteGouvernement[0];
    const plusEloigne = dto.proximiteGouvernement[dto.proximiteGouvernement.length - 1];

    const items: ParagraphItem[] = [
        {
            type: "text",
            content: `Pour la ${dto.legislature}ᵉ législature, le groupe de référence retenu pour le gouvernement est ${ref.label} (${ref.code}). Chaque groupe est comparé à lui, avec la même méthode que ci-dessus.`,
        },
        {
            type: "highlight",
            content: `${plusProche.groupeLabel} est le groupe qui vote le plus souvent comme ${ref.code} : ${plusProche.tauxProximite}% de positions identiques.`,
        },
    ];
    if (plusEloigne.groupeCode !== plusProche.groupeCode) {
        items.push({
            type: "text",
            content: `${plusEloigne.groupeLabel} est celui qui s'en démarque le plus, avec seulement ${plusEloigne.tauxProximite}% de positions identiques.`,
        });
    }

    return items;
}

/**
 * "Qui vote avec qui ?" — proximité de vote ENTRE groupes (pas la proximité
 * d'un·e député·e à son propre groupe, qui reste le thème `proximite-groupe`).
 * Route dédiée `/api/groupes/proximite/[legislature]` plutôt qu'une stat
 * catalogue : une paire de groupes ne rentre dans aucun shape `RawStatData`
 * (distribution/multi-series...) — même choix que `getGroupesAge`.
 * Source : `agg_groupes_stats_proximite_votes_legislature` (OK VALIDE côté
 * deputydex-data) ; méthodologie et périmètre dans
 * `IGroupesStatsRepository.getProximiteParPaire`. Les groupes renommés en
 * cours de législature sont additionnés sous leur code actuel côté domaine
 * (`groupe-lineage.constants.ts`, `groupes-proximite.mapper.ts`).
 *
 * Les deux sections appellent la même route (`useFetchSectionData` tourne
 * par section) — le second appel est servi par le cache serveur de la route
 * (`cachedRead`) quand il est actif, sans seconde requête SQL.
 */
async function fetchProximite(legislature: number) {
    const [proximite, cards] = await Promise.all([
        groupesGateways.getGroupesProximite(legislature),
        groupesGateways.getGroupesCards(legislature),
    ]);
    return { proximite, cards };
}

export const PROXIMITE_ENTRE_GROUPES_SECTIONS: PageSection[] = [
    {
        id: "proximite-entre-groupes-paires",
        label: "Quels groupes votent ensemble",
        icon: Network,
        description: "Pour chaque paire de groupes : la part des scrutins où leurs positions majoritaires " +
            "(pour, contre ou abstention) sont identiques, sur toute la législature. Un groupe renommé en cours de " +
            "législature compte comme un seul groupe (ex : UDR puis UDDPLR, SOC-NUPES puis SOC).",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const { proximite, cards } = await fetchProximite(leg);

            const tableRows: GroupeProximitePaireTableRow[] = proximite.paires.map((p, i) => ({
                ...p,
                rank: i + 1,
                groupes: [p.groupeACode, p.groupeBCode],
            }));

            return {
                "proximite-paires-recit": { legislature: leg, ...proximite },
                "table-proximite-paires": tableRows,
                "card-groupes-proximite-plus-proches": toPaireCards(proximite.plusProches, cards, "Les plus proches"),
                "card-groupes-proximite-plus-eloignes": toPaireCards(
                    isSamePaire(proximite.plusEloignes, proximite.plusProches) ? null : proximite.plusEloignes,
                    cards,
                    "Les plus éloignés"
                ),
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            { type: "card" as const, colSpan: 2, config: card("card-groupes-proximite-plus-proches") },
            { type: "card" as const, colSpan: 2, config: card("card-groupes-proximite-plus-eloignes") },
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "proximite-paires-recit",
                render: buildPairesRecit,
            },
            {
                type: "table" as const,
                colSpan: 4,
                ...table("table-proximite-paires"),
                title: "Toutes les paires de groupes, de la plus proche à la plus éloignée",
                export: {
                    filenameBase: "proximite-entre-groupes",
                    csvColumns: [
                        { header: "N°", value: (r) => r.rank },
                        { header: "Groupe A", value: (r) => r.groupeALabel },
                        { header: "Groupe B", value: (r) => r.groupeBLabel },
                        { header: "Votes identiques", value: (r) => `${r.tauxProximite}%` },
                        { header: "Scrutins comparés", value: (r) => r.nbScrutinsCommuns },
                    ],
                },
            } satisfies SectionBlock<GroupeProximitePaireTableRow>,
        ],
    },
    {
        id: "proximite-entre-groupes-gouvernement",
        label: "Qui vote comme le groupe du gouvernement",
        icon: Landmark,
        description: "La même mesure, vue depuis le groupe de référence du gouvernement : à quel point chaque " +
            "groupe vote-t-il comme lui ?",
        cols: 4,
        lazy: false,
        gatewayFn: async ({ legislature }: Record<string, unknown>) => {
            const leg = legislature as number;
            const { proximite } = await fetchProximite(leg);

            const tableRows: GroupeProximiteGouvernementTableRow[] = proximite.proximiteGouvernement.map((g, i) => ({ ...g, rank: i + 1 }));

            return {
                "proximite-gouvernement-recit": { legislature: leg, ...proximite },
                "table-proximite-gouvernement": tableRows,
            } as unknown as Record<string, BlockDataWrapper>;
        },
        blocks: [
            {
                type: "paragraph",
                colSpan: 4,
                dataId: "proximite-gouvernement-recit",
                render: buildGouvernementRecit,
            },
            {
                type: "table" as const,
                colSpan: 4,
                ...table("table-proximite-gouvernement"),
                title: "Proximité de chaque groupe avec le groupe de référence du gouvernement",
                export: {
                    filenameBase: "proximite-gouvernement",
                    csvColumns: [
                        { header: "N°", value: (r) => r.rank },
                        { header: "Groupe", value: (r) => r.groupeLabel },
                        { header: "Votes identiques", value: (r) => `${r.tauxProximite}%` },
                        { header: "Scrutins comparés", value: (r) => r.nbScrutinsCommuns },
                    ],
                },
            } satisfies SectionBlock<GroupeProximiteGouvernementTableRow>,
        ],
    },
];
