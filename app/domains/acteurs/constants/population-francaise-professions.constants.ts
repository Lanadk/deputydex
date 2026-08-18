/**
 * % de la population EN EMPLOI française par famille socio-professionnelle
 * (nomenclature INSEE PCS agrégée) — sert de point de comparaison à la
 * composition socio-professionnelle de l'Assemblée (voir `acteurs.professions-famille`,
 * `categories-socio-pro.sections.ts`). Clés = libellés `profession_famille`
 * canoniques réellement observés côté Assemblée (voir
 * `prisma-acteurs-stats.repository.ts`, `getProfessionFamilleDistribution`).
 *
 * "Population EN EMPLOI" — PAS "population active" (emploi + chômeurs) :
 * l'enquête Emploi de l'Insee mesure les personnes qui travaillent, pas les
 * chômeurs en recherche d'activité. Toujours dire "population en emploi"
 * dans l'UI, jamais "population active", pour rester exact.
 *
 * Une donnée par législature plutôt qu'un seul millésime : chaque
 * législature est comparée à l'année Insee la plus proche de sa propre
 * période, plutôt que de réutiliser un même millésime pour les deux.
 * - 16ᵉ législature (2022-2024) → enquête Emploi 2022, Insee Références
 *   "Emploi, chômage, revenus du travail", édition 2023.
 *   https://www.insee.fr/fr/statistiques/7456871?sommaire=7456956
 * - 17ᵉ législature (2024-...) → enquête Emploi 2024, même collection,
 *   édition 2025, parue le 26/06/2025.
 *   https://www.insee.fr/fr/statistiques/8376826?sommaire=8376908
 * Une législature absente de cette table (pas encore d'édition Insee
 * correspondante) doit retomber sur `null` partout, jamais sur le millésime
 * d'une autre législature.
 *
 * `null` = volontairement pas de valeur, PAS une donnée manquante à
 * compléter au prochain passage :
 * - "Retraités" / "Autres personnes sans activité professionnelle" sont, par
 *   construction, HORS de la population EN EMPLOI mesurée par cette table
 *   (ce sont des inactifs) — aucune édition de l'enquête Emploi n'aura de
 *   valeur pour ces deux lignes, il faudrait une table différente
 *   ("population totale par CSP") pour les renseigner un jour.
 * - "Sans profession déclarée" (côté Assemblée) n'a pas d'équivalent direct
 *   dans une table de population en emploi : ce n'est pas une CSP mais
 *   l'absence de profession déclarée par le/la député·e — comparer les deux
 *   pourcentages n'aurait pas de sens conceptuel, pas seulement une histoire
 *   de donnée manquante.
 */
export const POPULATION_FRANCAISE_PROFESSION_FAMILLE_PCT_BY_LEGISLATURE: Record<number, Record<string, number | null>> = {
    16: {
        "Agriculteurs exploitants": 1.6,
        "Artisans, commerçants et chefs d'entreprise": 6.8,
        "Cadres et professions intellectuelles supérieures": 21.7,
        "Professions intermédiaires": 24.6,
        "Employés": 26.0,
        "Ouvriers": 18.9,
        "Retraités": null,
        "Autres personnes sans activité professionnelle": null,
        "Sans profession déclarée": null,
    },
    17: {
        "Agriculteurs exploitants": 1.3,
        "Artisans, commerçants et chefs d'entreprise": 6.8,
        "Cadres et professions intellectuelles supérieures": 23.0,
        "Professions intermédiaires": 25.2,
        "Employés": 24.8,
        "Ouvriers": 18.0,
        "Retraités": null,
        "Autres personnes sans activité professionnelle": null,
        "Sans profession déclarée": null,
    },
};

/** Cité dans l'UI via un `ParagraphItem` de type `"source"` — voir `categories-socio-pro.sections.ts`. Une source par législature (millésime Insee différent). */
export const POPULATION_FRANCAISE_PROFESSION_SOURCE_BY_LEGISLATURE: Record<number, { label: string; href: string }> = {
    16: {
        label: "Source : Insee, population en emploi française (enquête Emploi 2022, Insee Références éd. 2023)",
        href: "https://www.insee.fr/fr/statistiques/7456871?sommaire=7456956",
    },
    17: {
        label: "Source : Insee, population en emploi française (enquête Emploi 2024, Insee Références éd. 2025, paru le 26/06/2025)",
        href: "https://www.insee.fr/fr/statistiques/8376826?sommaire=8376908",
    },
};

export function getPopulationFrancaiseProfessionFamillePct(legislature: number, professionFamille: string): number | null {
    return POPULATION_FRANCAISE_PROFESSION_FAMILLE_PCT_BY_LEGISLATURE[legislature]?.[professionFamille] ?? null;
}

export function getPopulationFrancaiseProfessionSource(legislature: number): { label: string; href: string } | null {
    return POPULATION_FRANCAISE_PROFESSION_SOURCE_BY_LEGISLATURE[legislature] ?? null;
}
