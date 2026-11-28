import { LucideIcon, Venus, CalendarDays, Vote, Handshake, Users, Briefcase, FileText, History, Map, RefreshCw, Megaphone, Gauge, PieChart, UsersRound, Network } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { TypeStat } from "@/app/(ui)/_shared/adapter/stat-type.adapter";
import { CalloutVariant } from "@/app/(ui)/component-library/molecules/callout/callout-lib";
import { FEMMES_ASSEMBLEE_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/femmes-assemblee.sections";
import { FEMINISATION_GROUPES_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/feminisation-groupes.sections";
import { AGE_DES_DEPUTES_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/age-des-deputes.sections";
import { EFFECTIFS_GROUPES_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/effectifs-groupes.sections";
import { POSITIONS_DE_VOTE_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/positions-de-vote.sections";
import { EXPRESSION_VOTES_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/expression-votes.sections";
import { CATEGORIES_SOCIO_PRO_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/categories-socio-pro.sections";
import { PARTICIPATION_PRESENCE_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/participation-presence.sections";
import { COHESION_GROUPES_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/cohesion-groupes.sections";
import { CUMUL_MANDATS_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/cumul-mandats.sections";
import { PROXIMITE_ENTRE_GROUPES_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/proximite-entre-groupes.sections";
import { PRESENCE_DEPUTES_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/presence-deputes.sections";

/**
 * Regroupement thématique du hub (`chiffres-cles-page-client.tsx`) — "humain"
 * = qui sont les député·es (démographie/profil), "groupes" = les groupes en
 * tant qu'entités (taille, stabilité — hors comportement de vote), "votes" =
 * tout ce qui touche au comportement de vote (individuel ou par groupe),
 * "activite" = l'activité législative elle-même (textes, pas les personnes).
 * L'ordre de ce tableau fixe l'ordre d'affichage des sections dans le hub.
 */
export const KEY_FIGURE_CATEGORIES = [
    { id: "humain", label: "Profil des député·es", icon: Users, color: "bleu" },
    { id: "groupes", label: "Les groupes parlementaires", icon: UsersRound, color: "rouge" },
    { id: "votes", label: "Votes de l'Assemblée", icon: Vote, color: "bleu" },
    { id: "activite", label: "Activité législative", icon: FileText, color: "blanc" },
] as const satisfies readonly { id: string; label: string; icon: LucideIcon; color: TypeStat }[];

export type KeyFigureCategory = (typeof KEY_FIGURE_CATEGORIES)[number];

/** Thèmes qui ont une page (au moins une section), dans l'ordre du registre. */
export function themesDisponibles(themes: KeyFigureTheme[] = KEY_FIGURE_THEMES): KeyFigureTheme[] {
    return themes.filter((theme) => theme.sections.length > 0);
}

/** Thèmes d'une catégorie, séparés entre ceux qui ont une page et ceux à venir. */
export function themesDeCategorie(categorie: KeyFigureCategoryId, themes: KeyFigureTheme[] = KEY_FIGURE_THEMES) {
    const ceux = themes.filter((theme) => theme.category === categorie);
    return {
        disponibles: ceux.filter((theme) => theme.sections.length > 0),
        aVenir: ceux.filter((theme) => theme.sections.length === 0),
    };
}

export type KeyFigureCategoryId = (typeof KEY_FIGURE_CATEGORIES)[number]["id"];

export interface KeyFigureTheme {
    /** Segment de route : /statistics/chiffres-cles/<slug> */
    slug: string;
    title: string;
    /** Teaser affiché sur la tuile du hub (chiffres-cles/page.tsx) */
    teaser: string;
    icon: LucideIcon;
    /**
     * Couleur du thème, un des trois « types » de la palette P1 (blanc / rouge / bleu,
     * voir `stat-type.adapter.ts`), la même partout : tuiles des Chiffres clés,
     * du hub Statistiques et de l'accueil. Deux thèmes voisins d'une même
     * catégorie n'ont pas la même.
     */
    color: TypeStat;
    /** Section du hub dans laquelle la tuile est regroupée — voir `KEY_FIGURE_CATEGORIES`. */
    category: KeyFigureCategoryId;
    /**
     * Contenu réel de la page, même moteur que `groupes/[code]`
     * (`PageSection[]` + `SectionBlockLoader`, voir `5.STATS-CATALOG_client_side.md`).
     * Vide = thème pas encore traité : la tuile reste visible dans le hub
     * (le registre décrit TOUS les thèmes prévus, pas seulement ceux prêts)
     * mais sa page affiche "Bientôt disponible" au lieu d'un contenu vide —
     * voir `[theme]/theme-page-client.tsx`.
     */
    sections: PageSection[];
    /**
     * Encadrés affichés sous l'en-tête de la page, avant les sections (voir
     * CalloutLib) — ex: prévenir qu'un indicateur est une approximation.
     */
    notices?: KeyFigureNotice[];
}

export interface KeyFigureNotice {
    variant: CalloutVariant;
    title?: string;
    paragraphs: string[];
}

/**
 * Catalogue des thèmes "Chiffres clés" — le pendant éditorial de
 * `STATS_CATALOG` (voir `5.STATS-CATALOG_client_side.md`). Ajouter un thème =
 * une entrée ici (+ un fichier `themes/<slug>.sections.ts` le jour où il a du
 * contenu réel) ; jamais besoin de toucher au hub, à l'index, ou à la route
 * dynamique `[theme]/`.
 */
export const KEY_FIGURE_THEMES: KeyFigureTheme[] = [
    // ── Profil des député·es ──────────────────────────────────────────────
    {
        slug: "femmes-assemblee",
        color: "bleu",
        title: "Les femmes à l'Assemblée nationale",
        teaser: "Répartition actuelle et évolution de la part de femmes élues, législature après législature.",
        icon: Venus,
        category: "humain",
        sections: FEMMES_ASSEMBLEE_SECTIONS,
    },
    {
        slug: "age-des-deputes",
        color: "rouge",
        title: "L'âge des député·es",
        teaser: "Les plus jeunes, les plus expérimenté·es, et la moyenne d'âge par groupe politique.",
        icon: CalendarDays,
        category: "humain",
        sections: AGE_DES_DEPUTES_SECTIONS,
    },
    {
        slug: "cumul-mandats",
        color: "blanc",
        title: "Le cumul des mandats",
        // Volet "qui cumule le plus de mandats" (individuel) pas encore
        // traité — pas de vue source côté deputydex-data ; teaser recentré
        // sur l'ancienneté par groupe (voir cumul-mandats.sections.ts).
        teaser: "Ancienneté moyenne à l'Assemblée des membres de chaque groupe.",
        icon: History,
        category: "humain",
        sections: CUMUL_MANDATS_SECTIONS,
    },
    {
        slug: "feminisation-groupes",
        color: "bleu",
        title: "La féminisation des groupes politiques",
        teaser: "Classement des groupes parlementaires par part de femmes parmi leurs membres.",
        icon: Users,
        category: "humain",
        sections: FEMINISATION_GROUPES_SECTIONS,
    },
    {
        slug: "categories-socio-pro",
        color: "rouge",
        title: "Les catégories socio-professionnelles",
        teaser: "Origines professionnelles des député·es avant leur mandat.",
        icon: Briefcase,
        category: "humain",
        sections: CATEGORIES_SOCIO_PRO_SECTIONS,
    },
    {
        slug: "origines-geographiques",
        color: "blanc",
        title: "Les origines géographiques des député·es",
        teaser: "Lieux d'élection et de naissance des député·es de chaque groupe.",
        icon: Map,
        category: "humain",
        sections: [],
    },

    // ── Les groupes parlementaires ────────────────────────────────────────
    {
        slug: "effectifs-groupes",
        color: "rouge",
        title: "La taille des groupes parlementaires",
        // Le volet "turnover" (député·es passé·es par un groupe) dépend de
        // agg_groupes_stats_stabilite, encore "PAS ENCORE VALIDE" côté
        // deputydex-data — teaser recentré sur l'effectif actuel, seule
        // donnée fiable disponible pour l'instant (voir
        // effectifs-groupes.sections.ts).
        teaser: "Effectif actuel de chaque groupe, du plus grand au plus petit.",
        icon: UsersRound,
        category: "groupes",
        sections: EFFECTIFS_GROUPES_SECTIONS,
    },
    {
        slug: "stabilite-groupes",
        color: "bleu",
        title: "La stabilité des groupes",
        teaser: "Entrées, sorties, taux de rotation — certains groupes sont plus stables que d'autres.",
        icon: RefreshCw,
        category: "groupes",
        sections: [],
    },

    // ── Votes de l'Assemblée ──────────────────────────────────────────────
    {
        slug: "cohesion-groupes",
        color: "bleu",
        title: "La cohésion des groupes",
        teaser: "Part des scrutins où les membres d'un même groupe votent dans le même sens.",
        icon: Vote,
        category: "votes",
        sections: COHESION_GROUPES_SECTIONS,
    },
    {
        slug: "proximite-entre-groupes",
        color: "rouge",
        title: "La proximité de vote entre groupes",
        teaser: "Les groupes qui votent le plus souvent dans le même sens, et ceux qui s'opposent le plus.",
        icon: Network,
        category: "votes",
        sections: PROXIMITE_ENTRE_GROUPES_SECTIONS,
    },
    {
        slug: "proximite-groupe",
        color: "blanc",
        title: "La proximité des député·es à leur groupe",
        teaser: "Alignement de chaque député sur la ligne de son groupe.",
        icon: Handshake,
        category: "votes",
        sections: [],
    },
    {
        slug: "assiduite-fidelite",
        color: "bleu",
        title: "Assiduité et fidélité des député·es",
        teaser: "Assiduité aux scrutins et fidélité au groupe, député par député.",
        icon: Gauge,
        category: "votes",
        sections: [],
    },
    {
        slug: "participation-presence",
        color: "blanc",
        title: "Participation & présence",
        teaser: "Participation aux scrutins, présence en séance et en commission, rythme de la semaine et évolution d'une année à l'autre.",
        icon: Vote,
        category: "votes",
        // Volet participation aux scrutins, puis volet présence (séance,
        // commission, jour par jour, années) — voir presence-deputes.sections.ts.
        sections: [...PARTICIPATION_PRESENCE_SECTIONS, ...PRESENCE_DEPUTES_SECTIONS],
        notices: [
            {
                variant: "warning",
                title: "Des estimations, pas un pointage",
                paragraphs: [
                    "L'Assemblée ne publie pas de registre de présence des député·es. Ces chiffres sont reconstitués à " +
                    "partir des seules traces laissées dans les données publiques : votes aux scrutins publics, prises " +
                    "de parole en séance, listes de présence des réunions de commission. Ils donnent une approximation, " +
                    "pas la présence réelle.",
                    "Ils sous-estiment la présence : un·e député·e assis·e dans l'hémicycle qui ne vote ni ne parle " +
                    "n'apparaît nulle part, et le travail en circonscription, les auditions, les missions ou les " +
                    "rendez-vous ministériels ne laissent aucune trace. Les séances sans aucun scrutin public ne sont " +
                    "pas comptées comme attendues, faute de pouvoir y voir qui était là.",
                    "La formule exacte figure sous chaque graphique. Ces chiffres permettent de " +
                    "comparer des député·es, des groupes ou des périodes entre eux, pas de juger l'assiduité d'une personne.",
                ],
            },
        ],
    },
    {
        slug: "positions-de-vote",
        color: "bleu",
        title: "Les positions de vote des groupes",
        teaser: "La répartition pour / contre / abstention de chaque groupe sur l'ensemble des scrutins.",
        icon: PieChart,
        category: "votes",
        sections: POSITIONS_DE_VOTE_SECTIONS,
    },
    {
        slug: "expression-votes",
        color: "rouge",
        title: "L'expression des votes",
        teaser: "Part des votes exprimés et des abstentions aux scrutins, groupe par groupe.",
        icon: Megaphone,
        category: "votes",
        sections: EXPRESSION_VOTES_SECTIONS,
    },

    // ── Activité législative ──────────────────────────────────────────────
    {
        slug: "textes-de-loi",
        color: "blanc",
        title: "Les textes de loi",
        teaser: "Nombre de textes examinés, législature après législature.",
        icon: FileText,
        category: "activite",
        sections: [],
    },
];

export function findKeyFigureTheme(slug: string): KeyFigureTheme | null {
    return KEY_FIGURE_THEMES.find((theme) => theme.slug === slug) ?? null;
}
