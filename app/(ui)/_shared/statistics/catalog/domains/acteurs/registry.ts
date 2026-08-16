import { defineStat } from "@/app/(ui)/_shared/statistics/catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";

export const ACTEURS_STATS: StatDefinition[] = [
    defineStat("acteurs", "age-distribution", {
        scope: "aggregate",
        title: "Répartition par tranche d'âge",
        category: "Démographie",
        keywords: ["âge", "démographie", "tranche d'âge", "députés"],
        description: "Montre à quoi ressemble l'Assemblée nationale en termes d'âge : combien de députés sont " +
            "jeunes, dans la force de l'âge ou plus expérimentés.",
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
        description: "Indique l'équilibre entre hommes et femmes parmi l'ensemble des députés actuellement en fonction.",
        methodology: "Répartition par genre déclaré, sur l'ensemble des députés recensés.",
        dataShape: "distribution",
        unit: "%",
    }),
    defineStat("acteurs", "mandats", {
        scope: "entity",
        title: "Nombre de mandats cumulés",
        category: "Profil",
        keywords: ["mandat", "ancienneté", "profil", "député"],
        description: "Donne une idée de l'ancienneté politique de ce député : combien de fois il a déjà été élu à " +
            "l'Assemblée nationale.",
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
        description: "De quels horizons professionnels viennent les député·es, avant leur mandat à l'Assemblée.",
        methodology: "Catégorie socio-professionnelle INSEE déclarée, sur l'ensemble des député·es actuellement en mandat à l'Assemblée (législature sélectionnée).",
        dataShape: "distribution",
        unit: "députés",
    }),
    defineStat("acteurs", "professions-famille", {
        scope: "aggregate",
        title: "Familles socio-professionnelles",
        category: "Profil",
        keywords: ["profession", "métier", "famille", "socio-professionnel", "profil", "députés"],
        description: "De quels horizons professionnels viennent les député·es, regroupés par grande famille (le niveau auquel l'INSEE publie des données comparables pour la population française).",
        methodology: "Famille socio-professionnelle INSEE déclarée, sur l'ensemble des député·es actuellement en mandat à l'Assemblée (législature sélectionnée) — regroupement plus large que « Catégories socio-professionnelles » (acteurs.professions).",
        dataShape: "distribution",
        unit: "députés",
    }),
];
