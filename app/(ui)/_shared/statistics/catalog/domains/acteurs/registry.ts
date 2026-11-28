import { defineStat } from "@/app/(ui)/_shared/statistics/catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";
import { PRESENCE_METHODOLOGIE, presenceMoyenneStats } from "@/app/(ui)/_shared/statistics/catalog/domains/presence-moyenne.stats";

const PRESENCE_ANNEES =
    " Valeur = jours de présence (toutes sources, attendus ou non, un jour compté une fois) divisés par les mois " +
    "actifs de la période (mois avec une séance ou un jour attendu : août exclu) — comparable d'une année complète " +
    "à une année entamée. Libellé préfixé par la législature (2024 relève de la 16ᵉ puis de la 17ᵉ).";

export const ACTEURS_STATS: StatDefinition[] = [
    defineStat("acteurs", "age-distribution", {
        scope: "aggregate",
        title: "Répartition par tranche d'âge",
        category: "Démographie",
        keywords: ["âge", "démographie", "tranche d'âge", "députés"],
        description: "Répartition des député·es par tranche d'âge, des plus jeunes aux plus expérimenté·es.",
        methodology:
            "Âge calculé à partir de la date de naissance déclarée de chaque député actuellement recensé, " +
            "regroupé par tranches de 10 ans (moins de 30 ans, 30-39, 40-49, 50-59, 60-69, 70 ans et plus).",
        dataShape: "distribution",
        unit: "députés",
    }),
    defineStat("acteurs", "parite", {
        scope: "aggregate",
        title: "Parité femmes / hommes",
        category: "Démographie",
        keywords: ["parité", "genre", "démographie", "députés"],
        description: "Indique l'équilibre entre hommes et femmes parmi l'ensemble des députés actuellement " +
            "en fonction. Taux de féminisation = femmes / (femmes + hommes) × 100.",
        methodology: "Répartition par genre déclaré (homme/femme), sur l'ensemble des député·es actuellement " +
            "en mandat pour la législature sélectionnée.",
        dataShape: "distribution",
        unit: "%",
    }),
    defineStat("acteurs", "mandats", {
        scope: "entity",
        title: "Nombre de mandats cumulés",
        category: "Profil",
        keywords: ["mandat", "ancienneté", "profil", "député"],
        description: "Ancienneté politique de ce député : nombre de mandats de député exercés à l'Assemblée nationale.",
        methodology: "Nombre de mandats de député détenus (mandat actuel compris) par ce député précis.",
        dataShape: "scalar",
        unit: "mandats",
        entityIdLabel: "Choisir un député",
    }),
    defineStat("acteurs", "professions", {
        scope: "aggregate",
        title: "Catégories socio-professionnelles",
        category: "Profil",
        keywords: ["profession", "métier", "socio-professionnel", "profil", "députés"],
        description: "Origines professionnelles des député·es avant leur mandat à l'Assemblée.",
        methodology: "Catégorie socio-professionnelle INSEE déclarée, sur l'ensemble des député·es actuellement en mandat à l'Assemblée (législature sélectionnée).",
        dataShape: "distribution",
        unit: "députés",
    }),
    defineStat("acteurs", "professions-famille", {
        scope: "aggregate",
        title: "Familles socio-professionnelles",
        category: "Profil",
        keywords: ["profession", "métier", "famille", "socio-professionnel", "profil", "députés"],
        description: "Origines professionnelles des député·es, regroupées par grande famille (le niveau auquel l'INSEE publie des données comparables pour la population française).",
        methodology: "Famille socio-professionnelle INSEE déclarée, sur l'ensemble des député·es actuellement en mandat à l'Assemblée (législature sélectionnée) — regroupement plus large que « Catégories socio-professionnelles » (acteurs.professions).",
        dataShape: "distribution",
        unit: "députés",
    }),

    // ── Présence ──────────────────────────────────────────────────────────
    defineStat("acteurs", "presence", {
        scope: "entity",
        title: "Taux de présence",
        category: "Présence",
        keywords: ["présence", "assiduité", "absence", "évolution", "mensuel", "député"],
        description: "Mois par mois, la part des jours où ce député était attendu (séance avec vote, convocation en commission) où il a effectivement été présent.",
        methodology: PRESENCE_METHODOLOGIE + " Taux = jours présents ÷ jours attendus du mois ; un mois sans jour attendu (vacances) n'a pas de point.",
        dataShape: "timeseries",
        unit: "%",
        entityIdLabel: "Choisir un député",
    }),
    defineStat("acteurs", "presence-jours-mensuels", {
        scope: "entity",
        title: "Jours de présence par mois",
        category: "Présence",
        keywords: ["présence", "jours", "volume", "mensuel", "député"],
        description: "Jours de présence de ce député, mois par mois — toutes sources confondues : vote, prise de parole, commission.",
        methodology: PRESENCE_METHODOLOGIE + " Volume : tout jour de présence, attendu ou non, compté une fois même si le député a voté, parlé et siégé en commission le même jour.",
        dataShape: "timeseries",
        unit: "jours",
        entityIdLabel: "Choisir un député",
    }),
    defineStat("acteurs", "presence-sources", {
        scope: "entity",
        title: "Jours de présence par source",
        category: "Présence",
        keywords: ["présence", "vote", "débat", "commission", "député"],
        description: "Origine des jours de présence de ce député : jours avec un vote, avec une prise de parole, en commission (un même jour peut cumuler plusieurs sources).",
        methodology: PRESENCE_METHODOLOGIE + " Une série par législature.",
        dataShape: "multi-series",
        unit: "jours",
        entityIdLabel: "Choisir un député",
    }),
    defineStat("acteurs", "presence-composantes", {
        scope: "entity",
        title: "Présence : séance, commission, scrutins",
        category: "Présence",
        keywords: ["présence", "séance", "commission", "scrutins", "excusé", "député"],
        description: "Le taux de présence de ce député et ses composantes : présence en séance, en commission (et excusé), participation aux scrutins — une série par législature.",
        methodology: PRESENCE_METHODOLOGIE + " Séance : jours de séance avec scrutin pendant le mandat. Commission : réunions où il est noté présent (ou excusé) parmi celles de ses organes. Scrutins : votes personnels parmi tous les scrutins publics de ses jours de mandat.",
        dataShape: "multi-series",
        unit: "%",
        entityIdLabel: "Choisir un député",
    }),
    defineStat("acteurs", "presence-annee-civile", {
        scope: "entity",
        title: "Présence par année civile",
        category: "Présence",
        keywords: ["présence", "année", "civile", "jours", "député"],
        description: "Jours de présence par mois, en moyenne, année civile par année civile (janvier → décembre).",
        methodology: PRESENCE_METHODOLOGIE + PRESENCE_ANNEES,
        dataShape: "timeseries",
        unit: "jours / mois",
        entityIdLabel: "Choisir un député",
    }),
    defineStat("acteurs", "presence-annee-parlementaire", {
        scope: "entity",
        title: "Présence par année parlementaire",
        category: "Présence",
        keywords: ["présence", "année", "parlementaire", "session", "jours", "député"],
        description: "Jours de présence par mois, en moyenne, par année parlementaire (1er octobre → 30 septembre, comme les sessions de l'Assemblée).",
        methodology: PRESENCE_METHODOLOGIE + PRESENCE_ANNEES,
        dataShape: "timeseries",
        unit: "jours / mois",
        entityIdLabel: "Choisir un député",
    }),
    defineStat("acteurs", "presence-annee-mandat", {
        scope: "entity",
        title: "Présence par année de mandat",
        category: "Présence",
        keywords: ["présence", "année", "mandat", "jours", "député"],
        description: "Jours de présence par mois, en moyenne, année de mandat par année de mandat (à partir de sa prise de fonction dans la législature).",
        methodology: PRESENCE_METHODOLOGIE + PRESENCE_ANNEES,
        dataShape: "timeseries",
        unit: "jours / mois",
        entityIdLabel: "Choisir un député",
    }),

    // ── Présence moyenne de tous les députés (« Tous les députés ») ──
    ...presenceMoyenneStats("acteurs"),
];
