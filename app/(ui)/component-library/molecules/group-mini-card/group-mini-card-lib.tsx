import React from "react";
import { GroupTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.types";

/**
 * Mini-carte statique aux couleurs d'un groupe parlementaire : bandeau avec
 * le code du groupe, motif hexagonal « RF » en filigrane, photo (ou
 * silhouette), nom et ligne secondaire.
 *
 * Volontairement sans effet 3D/holo (contrairement à `DeputyCard`) : elle est
 * affichée par dizaines sur le mur de l'accueil et dans le panneau de détail
 * de l'hémicycle. Les couleurs viennent du registre des groupes
 * (`theme/parliament-groups`) : corps en dégradé `bg[0] → bg[1]`, texte
 * `theme.text`.
 */
export type GroupMiniCardLibProps = {
    theme: GroupTheme;
    /** Texte du bandeau (code du groupe). */
    chip: string;
    name: string;
    subtitle?: string;
    image?: string | null;
    size?: "sm" | "md";
    className?: string;
};

const IMAGE_SIZE = { sm: 104, md: 120 } as const;

function isLightText(color: string): boolean {
    const hex = color.replace("#", "");
    if (hex.length !== 6) return true;
    const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}

const HexRF = () => (
    <svg className="group-mini-card__hex" viewBox="0 0 120 120" aria-hidden="true">
        <polygon points="60,6 106,33 106,87 60,114 14,87 14,33" fill="none" stroke="currentColor" strokeWidth="3" opacity=".28" />
        <polygon points="60,20 94,40 94,80 60,100 26,80 26,40" fill="none" stroke="currentColor" strokeWidth="2" opacity=".2" />
        <text x="60" y="73" textAnchor="middle" fontSize="30" fontWeight="800" fill="currentColor" opacity=".16">RF</text>
    </svg>
);

const Silhouette = () => (
    <svg className="group-mini-card__person" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="38" r="16" fill="currentColor" opacity=".35" />
        <path d="M14 100 C14 72 32 62 50 62 C68 62 86 72 86 100 Z" fill="currentColor" opacity=".35" />
    </svg>
);

export const GroupMiniCardLib: React.FC<GroupMiniCardLibProps> = ({
    theme,
    chip,
    name,
    subtitle,
    image,
    size = "sm",
    className = "",
}) => {
    const chipBackground = isLightText(theme.text) ? "rgba(255,255,255,.22)" : "rgba(0,0,0,.14)";

    return (
        <div
            className={`group-mini-card group-mini-card--${size} ${className}`}
            style={{
                background: `linear-gradient(160deg, ${theme.bg[0]}, ${theme.bg[1]})`,
                color: theme.text,
            }}
        >
            <span className="group-mini-card__chip" style={{ background: chipBackground }}>
                {chip}
            </span>
            <HexRF />
            {image ? (
                <img
                    className="group-mini-card__person"
                    src={image}
                    alt=""
                    width={IMAGE_SIZE[size]}
                    height={IMAGE_SIZE[size]}
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                <Silhouette />
            )}
            <div className="group-mini-card__meta">
                <strong>{name}</strong>
                {subtitle && <span>{subtitle}</span>}
            </div>
        </div>
    );
};
