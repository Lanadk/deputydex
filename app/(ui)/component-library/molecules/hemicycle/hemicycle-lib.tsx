"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/*
 * Plan d'hémicycle PROVISOIRE (SVG simple), en attendant celui de la branche
 * feat/accueil-hemicycle. Il occupe toute la largeur de son conteneur : la taille
 * d'affichage est fixée par l'appelant (voir block-hemicycle-renderer.tsx).
 */

export type HemicycleLibSeat = {
    id: string;
    /** Catégorie du siège (ex. position de vote) : sert à la mise en avant depuis la légende */
    key: string;
    color: string;
    /** Première ligne de l'info-bulle (ex. nom du député) */
    label: string;
    /** Seconde ligne de l'info-bulle (ex. groupe · vote) */
    sublabel?: string;
    /** Page ouverte au clic sur le siège */
    href?: string;
};

export type HemicycleLibLegendItem = {
    key: string;
    label: string;
    color: string;
    count?: number;
};

export type HemicycleLibProps = {
    /** Sièges dans l'ordre de la salle, de la gauche vers la droite */
    seats: HemicycleLibSeat[];
    legend?: HemicycleLibLegendItem[];
    /** Résumé lu par les lecteurs d'écran à la place du plan */
    ariaLabel: string;
};

// Repère du plan : demi-cercle de centre (500, 505) dans une boîte 1000 × 520.
const WIDTH = 1000;
const HEIGHT = 520;
const CENTER_X = 500;
const CENTER_Y = 505;
const ROWS = 12;
const R_MIN = 150;
const R_MAX = 465;

type Point = { x: number; y: number; theta: number; radius: number };

/**
 * Positions de `total` sièges : rangées concentriques, sièges par rangée proportionnels
 * au rayon, triés de la gauche vers la droite (angle décroissant) puis du centre vers
 * l'extérieur — le i-ème siège reçu occupe le i-ème point.
 */
export function computeHemicyclePoints(total: number): Point[] {
    if (total <= 0) return [];
    const radii = Array.from({ length: ROWS }, (_, k) => R_MIN + (k * (R_MAX - R_MIN)) / (ROWS - 1));
    const sum = radii.reduce((a, b) => a + b, 0);
    const counts = radii.map((r) => Math.round((total * r) / sum));
    counts[ROWS - 1] = Math.max(0, counts[ROWS - 1] + total - counts.reduce((a, b) => a + b, 0));

    const points: Point[] = [];
    radii.forEach((radius, k) => {
        for (let j = 0; j < counts[k]; j++) {
            const theta = Math.PI * (1 - (j + 0.5) / counts[k]);
            points.push({ theta, radius, x: CENTER_X + radius * Math.cos(theta), y: CENTER_Y - radius * Math.sin(theta) });
        }
    });
    return points.sort((p, q) => q.theta - p.theta || p.radius - q.radius).slice(0, total);
}

/** Rayon d'un siège : assez petit pour que deux sièges voisins d'une rangée ne se touchent pas. */
function seatRadius(total: number): number {
    const perimeter = Math.PI * ((R_MIN + R_MAX) / 2) * ROWS;
    return Math.max(3, Math.min(14, (perimeter / Math.max(total, 1)) * 0.38));
}

export const HemicycleLib: React.FC<HemicycleLibProps> = ({ seats, legend = [], ariaLabel }) => {
    const router = useRouter();
    const [hovered, setHovered] = useState<number | null>(null);
    const [highlight, setHighlight] = useState<string | null>(null);

    const points = useMemo(() => computeHemicyclePoints(seats.length), [seats.length]);
    const r = seatRadius(seats.length);
    const hoveredSeat = hovered !== null ? seats[hovered] : null;
    const hoveredPoint = hovered !== null ? points[hovered] : null;

    return (
        <div className="flex flex-col gap-3">
            <div className="relative w-full">
                <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label={ariaLabel}>
                    {seats.map((seat, i) => {
                        const p = points[i];
                        if (!p) return null;
                        const dimmed = highlight !== null && seat.key !== highlight;
                        return (
                            <circle
                                key={seat.id}
                                cx={p.x}
                                cy={p.y}
                                r={hovered === i ? r * 1.5 : r}
                                fill={seat.color}
                                opacity={dimmed ? 0.15 : 1}
                                stroke={hovered === i ? "currentColor" : "none"}
                                strokeWidth={2}
                                style={{ cursor: seat.href ? "pointer" : "default", transition: "opacity .2s, r .15s" }}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                                onClick={() => seat.href && router.push(seat.href)}
                            />
                        );
                    })}
                </svg>

                {hoveredSeat && hoveredPoint && (
                    <div
                        role="tooltip"
                        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-main bg-surface-1 px-3 py-2 text-sm shadow-lg whitespace-nowrap"
                        style={{
                            left: `${(hoveredPoint.x / WIDTH) * 100}%`,
                            top: `calc(${(hoveredPoint.y / HEIGHT) * 100}% - 12px)`,
                        }}
                    >
                        <div className="font-semibold">{hoveredSeat.label}</div>
                        {hoveredSeat.sublabel && <div className="text-xs text-gray-500">{hoveredSeat.sublabel}</div>}
                    </div>
                )}
            </div>

            {legend.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Légende">
                    {legend.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            aria-pressed={highlight === item.key}
                            onClick={() => setHighlight((h) => (h === item.key ? null : item.key))}
                            className="inline-flex items-center gap-2 rounded-full border border-main px-3 py-1 text-sm transition-opacity"
                            style={{ opacity: highlight !== null && highlight !== item.key ? 0.5 : 1 }}
                        >
                            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span>{item.label}</span>
                            {item.count !== undefined && <span className="font-semibold">{item.count}</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
