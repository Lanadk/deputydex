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
        description: "Répartition des députés selon leur âge, en regroupant les députés de l’ensemble des " +
            "législatures présentes dans la base de données. Cette statistique donne une vision globale de " +
            "la répartition des âges sur l’ensemble de la période étudiée.",
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
];
