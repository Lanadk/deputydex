import React from "react";
import { couleurScore } from "@/app/(ui)/component-library/molecules/cards/score-card/score-card-lib";
import { ScoreBreakdownItem } from "@/app/(ui)/component-library/template/sections/block-section/card-config.types";
import { formatNombreFr } from "@/app/_shared/utils/number";

type ScoreBreakdownCardLibProps = {
    title?: string;
    items: ScoreBreakdownItem[];
    footer?: string;
    className?: string;
};

const formatPoints = (v: number) => formatNombreFr(v, { max: 1 });

/**
 * Détail d'un score : une ligne par composante — son poids, son sous-score sur
 * 100 (barre) et les points qu'elle apporte au score (poids × sous-score).
 */
export const ScoreBreakdownCardLib: React.FC<ScoreBreakdownCardLibProps> = ({ title, items, footer, className = "" }) => (
    <div className={`border border-main rounded-lg bg-surface-2 p-5 ${className}`}>
        {title && <h3 className="text-sm font-bold uppercase tracking-wide mb-5">{title}</h3>}

        <ul className="flex flex-col gap-4">
            {items.map((item) => {
                const points = item.score == null ? null : (item.poids * item.score) / 100;
                return (
                    <li key={item.label} className="score-breakdown__ligne">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-sm font-semibold">{item.label}</span>
                                <span className="text-xs text-subtitle-accent">poids {item.poids} %</span>
                            </div>
                            {item.description && <p className="text-xs text-subtitle-accent mt-0.5">{item.description}</p>}
                        </div>

                        <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden" aria-hidden="true">
                            <div
                                className="h-full rounded-full"
                                style={{ width: `${item.score ?? 0}%`, backgroundColor: couleurScore(item.score) }}
                            />
                        </div>

                        <span className="text-sm font-semibold tabular-nums text-right whitespace-nowrap">
                            {item.score == null ? "—" : `${item.score}/100`}
                            <span className="block text-xs font-normal text-subtitle-accent">
                                {points == null ? "non compté" : `+${formatPoints(points)} pts`}
                            </span>
                        </span>
                    </li>
                );
            })}
        </ul>

        {footer && (
            <>
                <div className="my-5 border-t border-main" />
                <p className="text-sm text-subtitle-accent">{footer}</p>
            </>
        )}
    </div>
);
