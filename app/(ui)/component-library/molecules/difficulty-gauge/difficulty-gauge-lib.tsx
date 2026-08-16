import React from "react";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

const LEVEL_LABELS: Record<DifficultyLevel, string> = {
    1: "Facile",
    2: "Accessible",
    3: "Modéré",
    4: "Avancé",
    5: "Expert",
};

// Hauteurs croissantes en px, façon égaliseur — évite le cliché des étoiles.
const BAR_HEIGHTS = [6, 10, 14, 18, 22];

function colorForLevel(level: DifficultyLevel): string {
    if (level <= 2) return "var(--accent)";
    if (level === 3) return "var(--accent-warm)";
    return "var(--accent-danger)";
}

export interface DifficultyGaugeLibProps {
    /** Niveau de difficulté, de 1 (facile) à 5 (expert) */
    level: DifficultyLevel;
    /** Libellé affiché à côté de la jauge (déduit du niveau par défaut) */
    label?: string;
    /** Masquer le libellé texte à côté des barres */
    showLabel?: boolean;
    /** Taille de la jauge */
    size?: "small" | "medium";
}

export const DifficultyGaugeLib: React.FC<DifficultyGaugeLibProps> = ({
                                                                            level,
                                                                            label,
                                                                            showLabel = true,
                                                                            size = "medium",
                                                                        }) => {
    const color = colorForLevel(level);
    const displayLabel = label ?? LEVEL_LABELS[level];
    const scale = size === "small" ? 0.7 : 1;
    const barWidth = size === "small" ? 3 : 4;

    return (
        <div
            className="difficulty-gauge"
            role="img"
            aria-label={`Difficulté : ${displayLabel} (${level}/5)`}
        >
            <div className="difficulty-gauge__bars">
                {BAR_HEIGHTS.map((height, i) => {
                    const filled = i < level;
                    return (
                        <span
                            key={i}
                            className="difficulty-gauge__bar"
                            style={{
                                height: height * scale,
                                width: barWidth,
                                backgroundColor: filled ? color : "var(--border-main)",
                                opacity: filled ? 1 : 0.4,
                            }}
                        />
                    );
                })}
            </div>

            {showLabel && (
                <span className="difficulty-gauge__label" style={{color}}>
                    {displayLabel}
                </span>
            )}
        </div>
    );
};
