import React from "react";
import { ScoreCardBadge } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";

/**
 * Paliers de rareté du score (seuils du barème des « parses », sur 100), du
 * plus haut au plus bas : `min` = score minimal du palier. Couleurs de la
 * palette 1 du site (variables --p1-*, qui suivent le thème clair / sombre),
 * de la plus terne à la plus vive. Le chiffre et le verdict portent
 * l'information, la couleur n'est qu'un repère.
 */
export const PALIERS_SCORE = [
    { min: 100, nom: "Parfait", couleur: "var(--p1-red-4)" },
    { min: 99, nom: "Mythique", couleur: "var(--p1-red-3)" },
    { min: 95, nom: "Légendaire", couleur: "var(--p1-orange-3)" },
    { min: 75, nom: "Épique", couleur: "var(--p1-blue-4)" },
    { min: 50, nom: "Rare", couleur: "var(--p1-blue-3)" },
    { min: 25, nom: "Inhabituel", couleur: "var(--p1-green-3)" },
    { min: 0, nom: "Commun", couleur: "var(--p1-steel-2)" },
] as const;

export type PalierScore = (typeof PALIERS_SCORE)[number];

/** Palier d'un score ramené sur 100 ; null sans score. */
export function palierScore(score: number | null, max = 100): PalierScore | null {
    if (score == null) return null;
    const sur100 = (score / max) * 100;
    return PALIERS_SCORE.find((p) => sur100 >= p.min) ?? PALIERS_SCORE[PALIERS_SCORE.length - 1];
}

/** Couleur de la jauge (et des barres de détail) : celle du palier du score. */
export function couleurScore(score: number | null, max = 100): string {
    return palierScore(score, max)?.couleur ?? "var(--surface-3)";
}

type ScoreCardLibProps = {
    /** Score affiché ; null = pas de donnée. */
    score: number | null;
    /** Échelle du score (défaut : 100). */
    max?: number;
    /** Titre de la carte (ex. « Score d'activité »). */
    title: string;
    /** Lecture du score en quelques mots (ex. « Actif »). */
    verdict?: string;
    /** Phrase sous le verdict (ex. « Mieux que 64 % des députés »). */
    caption?: string;
    /** Badge en tête de carte (ex. « Aperçu »). */
    badge?: string;
    /** Badges obtenus, listés sous le verdict ; la description sert d'info-bulle. */
    badges?: ScoreCardBadge[];
    className?: string;
};

const RAYON = 52;
const CIRCONFERENCE = 2 * Math.PI * RAYON;

/**
 * Carte d'un score sur `max` : jauge circulaire, chiffre au centre, verdict,
 * légende et badges. La jauge est décorative (aria-hidden) : le texte suffit à
 * la lire. La carte garde la hauteur de son contenu : placée à côté de blocs
 * qui s'agrandissent (accordéon déplié), elle ne s'étire pas avec eux.
 */
export const ScoreCardLib: React.FC<ScoreCardLibProps> = ({ score, max = 100, title, verdict, caption, badge, badges = [], className = "" }) => {
    const part = score == null ? 0 : Math.max(0, Math.min(score / max, 1));
    const couleur = couleurScore(score, max);

    return (
        <div className={`score-card border border-main rounded-lg bg-surface-2 p-5 flex flex-col items-center gap-3 text-center ${className}`}>
            <div className="flex w-full items-center justify-between gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-left">{title}</h3>
                {badge && <span className="score-card__badge">{badge}</span>}
            </div>

            <div className="relative w-36 h-36">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden="true">
                    <circle cx="60" cy="60" r={RAYON} fill="none" stroke="var(--surface-3)" strokeWidth="10" />
                    <circle
                        cx="60"
                        cy="60"
                        r={RAYON}
                        fill="none"
                        stroke={couleur}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={CIRCONFERENCE}
                        strokeDashoffset={CIRCONFERENCE * (1 - part)}
                        className="score-card__arc"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold tabular-nums leading-none">{score ?? "—"}</span>
                    <span className="text-xs text-subtitle-accent mt-1">sur {max}</span>
                </div>
            </div>

            {verdict && <p className="text-lg font-bold">{verdict}</p>}
            {caption && <p className="text-sm text-subtitle-accent">{caption}</p>}

            {badges.length > 0 && (
                <div className="score-card__badges">
                    <h4 className="score-card__badges-titre">Badges</h4>
                    <ul className="score-card__badges-liste" aria-label="Badges obtenus">
                        {badges.map((b) => (
                            <li key={b.label} className="score-card__badge-obtenu" title={b.description}>
                                {b.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
