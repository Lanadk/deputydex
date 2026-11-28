"use client";

import React from "react";
import { CalendarDays } from "lucide-react";
import { AnchorSectionBlockLib } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-section-block-lib";
import { BlockDataWrapper, BlockSectionRenderer, SectionBlock } from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import { ActivityCalendarDay } from "@/app/(ui)/component-library/template/sections/block-section/activity-calendar-config.types";
import { ScoreBreakdownItem } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";

/**
 * Démo de la section « Activité et score » de la fiche député, en données
 * SIMULÉES (aucun appel réseau) : mêmes blocs et même disposition que la fiche
 * (score à gauche sur deux rangées, calendrier à droite, détail dessous).
 */

/** Générateur pseudo-aléatoire à graine fixe : la démo est identique à chaque affichage. */
function aleatoire(graine: number) {
    let s = graine;
    return () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
    };
}

/**
 * Une année parlementaire simulée : activité surtout du mardi au jeudi, plus
 * faible le lundi et le vendredi, rien le week-end ni en août.
 */
export function calendrierSimule(debut = "2025-10-01", jours = 365): ActivityCalendarDay[] {
    const tirage = aleatoire(17);
    const depart = new Date(`${debut}T00:00:00Z`);
    return Array.from({ length: jours }, (_, i) => {
        const d = new Date(depart.getTime() + i * 86_400_000);
        const jour = d.getUTCDay();
        const aout = d.getUTCMonth() === 7;
        const intensite = aout || jour === 0 || jour === 6 ? 0 : jour >= 2 && jour <= 4 ? 0.85 : 0.35;
        const count = tirage() < intensite ? Math.ceil(tirage() * 14) : 0;
        const level = count === 0 ? 0 : count < 4 ? 1 : count < 8 ? 2 : count < 11 ? 3 : 4;
        return { date: d.toISOString().slice(0, 10), count, level };
    });
}

const COMPOSANTES: ScoreBreakdownItem[] = [
    { label: "Présence", description: "Jours de présence parmi les jours où il était attendu (séance avec vote, commission).", poids: 30, score: 72 },
    { label: "Participation aux votes", description: "Votes exprimés parmi les scrutins où il pouvait voter.", poids: 25, score: 58 },
    { label: "Amendements", description: "Amendements déposés et adoptés, rapportés aux autres députés.", poids: 25, score: 64 },
    { label: "Interventions en séance", description: "Prises de parole dans l'hémicycle.", poids: 10, score: 41 },
    { label: "Travail sur les textes", description: "Rôle de rapporteur, textes déposés ou co-signés.", poids: 10, score: 35 },
];

const DATA: Record<string, BlockDataWrapper> = {
    "demo-calendrier": { data: calendrierSimule() },
    "demo-score": {
        // 30 × 72 + 25 × 58 + 25 × 64 + 10 × 41 + 10 × 35, ÷ 100 = 59,7 → 60.
        data: {
            title: "Score",
            score: 60,
            verdict: "Actif",
            caption: "Mieux que 64 % des députés de la législature",
            badge: "Aperçu",
            badges: [
                { label: "Assidu en séance", description: "Présent à plus de 70 % des séances avec vote." },
                { label: "Amendeur", description: "Parmi le quart des députés qui déposent le plus d'amendements." },
                { label: "Pilier de commission", description: "Présent à plus de 80 % des réunions de ses commissions." },
            ],
        },
    },
    "demo-score-detail": {
        data: { title: "Détail du score", items: COMPOSANTES, footer: "Aperçu : composantes, poids et valeurs fictifs." },
    },
} as unknown as Record<string, BlockDataWrapper>;

const BLOCKS: SectionBlock[] = [
    { type: "card", colSpan: 1, rowSpan: 2, config: { id: "demo-score", displayType: "score-card" } },
    // Seul type rendu par le calendrier ; sans action de clic, les jours ne mènent nulle part.
    { type: "activity-calendar", colSpan: 3, config: { id: "demo-calendrier", displayType: "tooltip-and-href", title: "Calendrier d'activité" } },
    {
        type: "card",
        colSpan: 3,
        config: { id: "demo-score-detail", displayType: "score-breakdown-card" },
        formulas: [{
            label: "score du député",
            result: "S_{d}",
            numerator: "Σ_{k} w_{k} · s_{d,k}",
            denominator: "Σ_{k} w_{k}",
            legend: [
                { symbol: "k", description: "une composante du score, avec un sous-score connu" },
                { symbol: "w_{k}", description: "poids de la composante (en %, total 100)" },
                { symbol: "s_{d,k}", description: "sous-score du député pour la composante k, sur 100" },
            ],
        }],
    },
];

export function ActiviteScoreDemo() {
    return (
        <div className="w-full">
            <AnchorSectionBlockLib
                id="demo-activite-score"
                title="Activité et score"
                description="Démo en données simulées : jours d'activité du député sur l'année et son score pour en avoir une première idée."
                icon={CalendarDays}
                cols={4}
            >
                {BLOCKS.map((block, i) => (
                    <BlockSectionRenderer key={i} block={block} dataMap={DATA} loading={false} params={{}} />
                ))}
            </AnchorSectionBlockLib>
        </div>
    );
}
