import { defineStat } from "@/app/(ui)/(views)/(db)/statistics/_catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/(views)/(db)/statistics/_catalog/stat-definition.types";

export const ACTEURS_STATS: StatDefinition[] = [
    defineStat("acteurs", "age-distribution", {
        scope: "aggregate",
        title: "Répartition par tranche d'âge",
        category: "Démographie",
        keywords: ["âge", "démographie", "tranche d'âge", "députés"],
        methodology:
            "Âge calculé à partir de la date de naissance déclarée de chaque député actuellement recensé, " +
            "regroupé par tranches de 10 ans (moins de 30 ans, 30-39, 40-49, 50-59, 60-69, 70 ans et plus).",
        dataShape: "distribution",
        unit: "députés",
    }),
    // TODO: mock — à remplacer par une vraie requête (civilite) quand le backend sera branché.
    defineStat("acteurs", "parite", {
        scope: "aggregate",
        title: "Parité hommes / femmes",
        category: "Démographie",
        keywords: ["parité", "genre", "démographie", "députés"],
        methodology: "Répartition par genre déclaré, sur l'ensemble des députés recensés.",
        dataShape: "distribution",
        unit: "%",
    }),
    // TODO: mock — à remplacer par une vraie requête (mandats) quand le backend sera branché.
    defineStat("acteurs", "mandats", {
        scope: "entity",
        title: "Nombre de mandats cumulés",
        category: "Profil",
        keywords: ["mandat", "ancienneté", "profil", "député"],
        methodology: "Nombre de mandats de député détenus (mandat actuel compris) par ce député précis.",
        dataShape: "scalar",
        unit: "mandats",
        entityIdLabel: "Choisir un député",
    }),
];
