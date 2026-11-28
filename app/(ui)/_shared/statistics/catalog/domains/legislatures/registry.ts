import { defineStat } from "@/app/(ui)/_shared/statistics/catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";

/** Méthodologie commune des stats de présence de l'Assemblée (vues `agg_assemblee_presence*` de deputydex-data). */
const ASSEMBLEE_PRESENCE_METHODOLOGIE =
    "Tous députés et groupes confondus, toutes législatures (une série ou un libellé par législature). Jour " +
    "attendu : séance publique avec au moins un scrutin public, ou convocation en commission d'un organe dont le " +
    "député est membre. Présent : vote personnel (hors délégation), prise de parole ou interruption en séance, " +
    "présence en commission. Taux pondérés : somme des jours présents ÷ somme des jours attendus de tous les députés.";

// Branché sur agg_groupes_stats_parite, sommé par législature — voir
// STAT_HANDLERS dans app/api/statistics/[domain]/[statId]/route.ts.
export const LEGISLATURES_STATS: StatDefinition[] = [
    defineStat("legislatures", "parite", {
        scope: "aggregate",
        title: "Évolution de la parité",
        category: "Composition",
        keywords: ["parité", "évolution", "législatures"],
        description: "Montre si la part de femmes élues à l'Assemblée progresse ou recule d'une législature à l'autre.",
        methodology: "Pour chaque législature : nombre total de député·es femmes ayant siégé / nombre total de " +
            "député·es ayant siégé (tous groupes confondus, y compris Non inscrits) × 100 — une valeur par " +
            "législature, du début de la Vᵉ République à aujourd'hui.",
        dataShape: "timeseries",
        unit: "%",
    }),

    // ── Présence de l'Assemblée ───────────────────────────────────────────
    defineStat("legislatures", "presence", {
        scope: "aggregate",
        title: "Taux de présence de l'Assemblée",
        category: "Présence",
        keywords: ["présence", "assiduité", "assemblée", "législatures"],
        description: "La part des jours attendus où les député·es ont été présent·es, pour toute l'Assemblée, législature par législature.",
        methodology: ASSEMBLEE_PRESENCE_METHODOLOGIE,
        dataShape: "timeseries",
        unit: "%",
    }),
    defineStat("legislatures", "presence-composantes", {
        scope: "aggregate",
        title: "Présence : séance, commission, scrutins",
        category: "Présence",
        keywords: ["présence", "séance", "commission", "scrutins", "excusés", "assemblée"],
        description: "Le taux de présence et ses composantes : présence en séance, en commission (et excusés), participation aux scrutins.",
        methodology: ASSEMBLEE_PRESENCE_METHODOLOGIE + " Séance : jours de séance avec scrutin. Commission : présences et excuses parmi les convocations de membres. Scrutins : votes personnels parmi tous les scrutins publics des jours de mandat (une journée peut en compter des centaines).",
        dataShape: "multi-series",
        unit: "%",
    }),
    defineStat("legislatures", "presence-evolution", {
        scope: "aggregate",
        title: "Évolution du taux de présence de l'Assemblée",
        category: "Présence",
        keywords: ["présence", "évolution", "mensuel", "assemblée"],
        description: "Mois par mois, la part des jours attendus où les député·es ont été présent·es, toute l'Assemblée confondue.",
        methodology: ASSEMBLEE_PRESENCE_METHODOLOGIE + " Un mois sans séance avec vote ne reflète que les commissions.",
        dataShape: "timeseries",
        unit: "%",
    }),
    defineStat("legislatures", "presence-jours-mensuels", {
        scope: "aggregate",
        title: "Jours de présence d'un député par mois",
        category: "Présence",
        keywords: ["présence", "jours", "volume", "mensuel", "assemblée"],
        description: "Combien de jours, chaque mois, un·e député·e est présent·e en moyenne — toutes sources confondues : vote, prise de parole, commission.",
        methodology: ASSEMBLEE_PRESENCE_METHODOLOGIE + " Jours de présence (attendus ou non, un jour compté une fois) ÷ députés actifs du mois.",
        dataShape: "timeseries",
        unit: "jours",
    }),
    defineStat("legislatures", "presence-journaliere", {
        scope: "aggregate",
        title: "Présence en séance, jour par jour",
        category: "Présence",
        keywords: ["présence", "jour", "quotidien", "séance", "assemblée"],
        description: "Pour chaque jour de séance avec au moins un scrutin public, la part des député·es en mandat présent·es en séance.",
        methodology: ASSEMBLEE_PRESENCE_METHODOLOGIE + " Présent en séance : vote personnel, prise de parole, interruption ou présidence. Jours de commission seule exclus (seuls les membres convoqués y sont attendus).",
        dataShape: "timeseries",
        unit: "%",
    }),
    defineStat("legislatures", "presence-jour-semaine", {
        scope: "aggregate",
        title: "Présence selon le jour de la semaine",
        category: "Présence",
        keywords: ["présence", "semaine", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "assemblée"],
        description: "Le rythme de la semaine parlementaire : la présence est la plus forte le mardi et le mercredi (votes solennels, questions au Gouvernement), plus faible le lundi et le vendredi (circonscription).",
        methodology: ASSEMBLEE_PRESENCE_METHODOLOGIE + " Une série par législature.",
        dataShape: "multi-series",
        unit: "%",
    }),
    defineStat("legislatures", "presence-annee-civile", {
        scope: "aggregate",
        title: "Présence de l'Assemblée par année civile",
        category: "Présence",
        keywords: ["présence", "année", "civile", "jours", "assemblée"],
        description: "Jours de présence par mois d'un·e député·e, en moyenne, année civile par année civile (janvier → décembre).",
        methodology: ASSEMBLEE_PRESENCE_METHODOLOGIE + " Valeur = jours de présence ÷ mois-députés actifs de l'année. Libellé préfixé par la législature (2024 relève de la 16ᵉ puis de la 17ᵉ).",
        dataShape: "timeseries",
        unit: "jours / mois",
    }),
    defineStat("legislatures", "presence-annee-parlementaire", {
        scope: "aggregate",
        title: "Présence de l'Assemblée par année parlementaire",
        category: "Présence",
        keywords: ["présence", "année", "parlementaire", "session", "jours", "assemblée"],
        description: "Jours de présence par mois d'un·e député·e, en moyenne, par année parlementaire (1er octobre → 30 septembre, comme les sessions de l'Assemblée).",
        methodology: ASSEMBLEE_PRESENCE_METHODOLOGIE + " Valeur = jours de présence ÷ mois-députés actifs de l'année. Juillet–septembre 2024 (début de la 17ᵉ) relève de « 2023-2024 », comme à l'Assemblée.",
        dataShape: "timeseries",
        unit: "jours / mois",
    }),
];
