import { LucideIcon, Venus, CalendarDays, Vote, Handshake, Users, Briefcase, FileText } from "lucide-react";
import { PageSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { FEMMES_ASSEMBLEE_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/femmes-assemblee.sections";
import { FEMINISATION_GROUPES_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/feminisation-groupes.sections";
import { AGE_DES_DEPUTES_SECTIONS } from "@/app/(ui)/(views)/(db)/statistics/chiffres-cles/themes/age-des-deputes.sections";

export interface KeyFigureTheme {
    /** Segment de route : /statistics/chiffres-cles/<slug> */
    slug: string;
    title: string;
    /** Teaser affiché sur la tuile du hub (chiffres-cles/page.tsx) */
    teaser: string;
    icon: LucideIcon;
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
    {
        slug: "femmes-assemblee",
        title: "Les femmes à l'Assemblée nationale",
        teaser: "Répartition actuelle et évolution de la part de femmes élues, législature après législature.",
        icon: Venus,
        sections: FEMMES_ASSEMBLEE_SECTIONS,
    },
    {
        slug: "age-des-deputes",
        title: "L'âge des député·es",
        teaser: "Les plus jeunes, les plus expérimenté·es, et la moyenne d'âge par groupe politique.",
        icon: CalendarDays,
        sections: AGE_DES_DEPUTES_SECTIONS,
    },
    {
        slug: "feminisation-groupes",
        title: "La féminisation des groupes politiques",
        teaser: "Classement des groupes parlementaires par part de femmes parmi leurs membres.",
        icon: Users,
        sections: FEMINISATION_GROUPES_SECTIONS,
    },
    {
        slug: "cohesion-groupes",
        title: "La cohésion des groupes",
        teaser: "À quel point les membres d'un même groupe votent-ils ensemble ?",
        icon: Vote,
        sections: [],
    },
    {
        slug: "proximite-groupe",
        title: "La proximité des député·es à leur groupe",
        teaser: "Dans quelle mesure chaque député suit-il la ligne de son groupe ?",
        icon: Handshake,
        sections: [],
    },
    {
        slug: "participation-presence",
        title: "Participation & présence",
        teaser: "Qui vote, qui s'abstient, qui est absent — et comment ça évolue.",
        icon: Vote,
        sections: [],
    },
    {
        slug: "categories-socio-pro",
        title: "Les catégories socio-professionnelles",
        teaser: "De quels horizons professionnels viennent les député·es ?",
        icon: Briefcase,
        sections: [],
    },
    {
        slug: "textes-de-loi",
        title: "Les textes de loi",
        teaser: "Nombre de textes examinés, législature après législature.",
        icon: FileText,
        sections: [],
    },
];

export function findKeyFigureTheme(slug: string): KeyFigureTheme | null {
    return KEY_FIGURE_THEMES.find((theme) => theme.slug === slug) ?? null;
}
