import { LucideIcon, Venus, CalendarDays, Vote, Handshake, Users, Briefcase, FileText, History, Map, RefreshCw, Megaphone, Gauge, PieChart, UsersRound } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { FEMMES_ASSEMBLEE_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/femmes-assemblee.sections";
import { FEMINISATION_GROUPES_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/feminisation-groupes.sections";
import { AGE_DES_DEPUTES_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/age-des-deputes.sections";

/**
 * Regroupement thématique du hub (`chiffres-cles-page-client.tsx`) — "humain"
 * = qui sont les député·es (démographie/profil), "groupes" = les groupes en
 * tant qu'entités (taille, stabilité — hors comportement de vote), "votes" =
 * tout ce qui touche au comportement de vote (individuel ou par groupe),
 * "activite" = l'activité législative elle-même (textes, pas les personnes).
 * L'ordre de ce tableau fixe l'ordre d'affichage des sections dans le hub.
 */
export const KEY_FIGURE_CATEGORIES = [
    { id: "humain", label: "Qui sont les député·es ?" },
    { id: "groupes", label: "Les groupes parlementaires" },
    { id: "votes", label: "Comment vote l'Assemblée ?" },
    { id: "activite", label: "Activité législative" },
] as const;

export type KeyFigureCategoryId = (typeof KEY_FIGURE_CATEGORIES)[number]["id"];

export interface KeyFigureTheme {
    /** Segment de route : /statistics/chiffres-cles/<slug> */
    slug: string;
    title: string;
    /** Teaser affiché sur la tuile du hub (chiffres-cles/page.tsx) */
    teaser: string;
    icon: LucideIcon;
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
}

/**
 * Catalogue des thèmes "Chiffres clés" — le pendant éditorial de
 * `STATS_CATALOG` (voir `5.STATS-CATALOG_client_side.md`). Ajouter un thème =
 * une entrée ici (+ un fichier `themes/<slug>.sections.ts` le jour où il a du
 * contenu réel) ; jamais besoin de toucher au hub, à l'index, ou à la route
 * dynamique `[theme]/`.
 */
export const KEY_FIGURE_THEMES: KeyFigureTheme[] = [
    // ── Qui sont les député·es ? ──────────────────────────────────────────
    {
        slug: "femmes-assemblee",
        title: "Les femmes à l'Assemblée nationale",
        teaser: "Répartition actuelle et évolution de la part de femmes élues, législature après législature.",
        icon: Venus,
        category: "humain",
        sections: FEMMES_ASSEMBLEE_SECTIONS,
    },
    {
        slug: "age-des-deputes",
        title: "L'âge des député·es",
        teaser: "Les plus jeunes, les plus expérimenté·es, et la moyenne d'âge par groupe politique.",
        icon: CalendarDays,
        category: "humain",
        sections: AGE_DES_DEPUTES_SECTIONS,
    },
    {
        slug: "cumul-mandats",
        title: "Le cumul des mandats",
        teaser: "Ancienneté moyenne par groupe, et qui cumule le plus de mandats à l'Assemblée.",
        icon: History,
        category: "humain",
        sections: [],
    },
    {
        slug: "feminisation-groupes",
        title: "La féminisation des groupes politiques",
        teaser: "Classement des groupes parlementaires par part de femmes parmi leurs membres.",
        icon: Users,
        category: "humain",
        sections: FEMINISATION_GROUPES_SECTIONS,
    },
    {
        slug: "categories-socio-pro",
        title: "Les catégories socio-professionnelles",
        teaser: "De quels horizons professionnels viennent les député·es ?",
        icon: Briefcase,
        category: "humain",
        sections: [],
    },
    {
        slug: "origines-geographiques",
        title: "Les origines géographiques des député·es",
        teaser: "D'où sont élu·es les député·es de chaque groupe, et où sont-ils/elles né·es.",
        icon: Map,
        category: "humain",
        sections: [],
    },

    // ── Les groupes parlementaires ────────────────────────────────────────
    {
        slug: "effectifs-groupes",
        title: "La taille des groupes parlementaires",
        teaser: "Quel est le plus grand groupe, le plus petit, et combien de député·es sont passé·es par chacun depuis le début de la législature.",
        icon: UsersRound,
        category: "groupes",
        sections: [],
    },
    {
        slug: "stabilite-groupes",
        title: "La stabilité des groupes",
        teaser: "Entrées, sorties, taux de rotation — certains groupes sont plus stables que d'autres.",
        icon: RefreshCw,
        category: "groupes",
        sections: [],
    },

    // ── Comment vote l'Assemblée ? ────────────────────────────────────────
    {
        slug: "cohesion-groupes",
        title: "La cohésion des groupes",
        teaser: "À quel point les membres d'un même groupe votent-ils ensemble ?",
        icon: Vote,
        category: "votes",
        sections: [],
    },
    {
        slug: "proximite-groupe",
        title: "La proximité des député·es à leur groupe",
        teaser: "Dans quelle mesure chaque député suit-il la ligne de son groupe ?",
        icon: Handshake,
        category: "votes",
        sections: [],
    },
    {
        slug: "assiduite-fidelite",
        title: "Assiduité et fidélité des député·es",
        teaser: "Qui vote le plus souvent, qui reste le plus fidèle à son groupe — et qui s'en écarte le plus.",
        icon: Gauge,
        category: "votes",
        sections: [],
    },
    {
        slug: "participation-presence",
        title: "Participation & présence",
        teaser: "Qui vote, qui s'abstient, qui est absent — et comment ça évolue.",
        icon: Vote,
        category: "votes",
        sections: [],
    },
    {
        slug: "positions-de-vote",
        title: "Comment votent les groupes",
        teaser: "La répartition pour / contre / abstention de chaque groupe sur l'ensemble des scrutins.",
        icon: PieChart,
        category: "votes",
        sections: [],
    },
    {
        slug: "expression-votes",
        title: "L'expression des votes",
        teaser: "Quels groupes s'expriment le plus aux scrutins, et lesquels s'abstiennent le plus souvent.",
        icon: Megaphone,
        category: "votes",
        sections: [],
    },

    // ── Activité législative ──────────────────────────────────────────────
    {
        slug: "textes-de-loi",
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
