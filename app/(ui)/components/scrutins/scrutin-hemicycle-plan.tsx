"use client";

import React, { useMemo, useRef, useState } from "react";
import { computeHemicycleSeats } from "@/app/(ui)/components/hemicycle/hemicycle-seats";
import { HemicycleLegendItem, HemicycleSeatData } from "@/app/(ui)/component-library/template/sections/block-section/hemicycle-config.types";
import { AvatarLib } from "@/app/(ui)/component-library/atoms/badge-avatar/avatar-picture-lib";

type ScrutinHemicyclePlanProps = {
    /** Sièges dans l'ordre de la salle, de la gauche vers la droite */
    seats: HemicycleSeatData[];
    legend?: HemicycleLegendItem[];
    ariaLabel: string;
    /** Titre optionnel, centré au-dessus du plan */
    title?: string;
    /** Sous-titre optionnel, sous le titre */
    subtitle?: string;
    /**
     * Soulève le siège survolé (effet 3D du plan de #161). Désactivé par défaut :
     * sur la fiche scrutin, l'info-bulle suffit et le soulèvement masque les voisins.
     */
    liftOnHover?: boolean;
    /**
     * Taille des sièges, en multiple de la taille d'origine du plan (1). Plus gros,
     * ils sont plus faciles à survoler ; au-delà de ~1.4, ils se touchent.
     */
    seatScale?: number;
};

export const DEFAULT_SEAT_SCALE = 1.2;

/**
 * Hémicycle d'un scrutin sur le plan 3D de #161 : réutilise le calcul des positions
 * (`computeHemicycleSeats`) et les styles `hemicycle-*`, sans modifier ces composants.
 * Ajoute la couleur par vote, une info-bulle au survol (photo, député, groupe, vote) et la
 * mise en avant d'une position depuis la légende.
 *
 * Les variables --hemi-* sont posées ici : sa page les pose sur `.hemicycle-page`,
 * avec une marge négative (--hemi-lift) qui n'a pas de sens dans une section.
 */
const STAGE_VARS = {
    "--hemi-lift": "0",
    "--hemi-view": "22%",
    "--hemi-tilt": "42deg",
} as React.CSSProperties;

type Hover = { index: number; x: number; y: number };

export function ScrutinHemicyclePlan({
    seats,
    legend = [],
    ariaLabel,
    title,
    subtitle,
    liftOnHover = false,
    seatScale = DEFAULT_SEAT_SCALE,
}: ScrutinHemicyclePlanProps) {
    const stageVars = { ...STAGE_VARS, "--hemi-seat-scale": String(seatScale) } as React.CSSProperties;
    const containerRef = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState<Hover | null>(null);
    const [highlight, setHighlight] = useState<string | null>(null);

    // Un seul « groupe » couvrant tous les sièges : on ne veut que les positions,
    // dans l'ordre gauche → droite ; l'ordre des sièges reçus fait le reste.
    const positions = useMemo(() => computeHemicycleSeats([{ code: "salle", count: seats.length }]), [seats.length]);
    const total = positions.length;
    // Un siège grisé par la mise en avant d'une position n'a pas d'info-bulle
    // (y compris s'il était survolé au moment du clic sur la légende).
    const isOnSeat = (seat: HemicycleSeatData | undefined) => !!seat && (highlight === null || seat.key === highlight);
    const hoveredSeat = hover && isOnSeat(seats[hover.index]) ? seats[hover.index] : null;
    const tooltipTheme = hoveredSeat?.tooltipTheme;

    // Le plan est incliné en 3D : l'info-bulle suit la souris plutôt que la position
    // (déformée par la perspective) du siège.
    const trackHover = (index: number) => (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setHover({ index, x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div className="flex flex-col gap-4">
            {(title || subtitle) && (
                <div className="flex flex-col items-center gap-1 text-center">
                    {title && <h3 className="text-lg font-semibold">{title}</h3>}
                    {subtitle && <p className="text-sm text-subtitle-accent">{subtitle}</p>}
                </div>
            )}

            <div ref={containerRef} className="relative">
                <div className="hemicycle-stage" style={stageVars} role="img" aria-label={ariaLabel}>
                    <div className="hemicycle-plane">
                        <div className="hemicycle-glow" />
                        {positions.map((p, i) => {
                            const seat = seats[i];
                            if (!seat) return null;
                            const isOn = isOnSeat(seat);
                            const isHovered = isOn && hover?.index === i;
                            const lift = liftOnHover && isHovered ? "translateZ(30px) scale(1.6) " : highlight && isOn ? "translateZ(18px) " : "";
                            const style: React.CSSProperties = {
                                left: `${p.left.toFixed(2)}%`,
                                top: `${p.top.toFixed(2)}%`,
                                background: seat.color,
                                animationDelay: `${((p.index / total) * 1.4).toFixed(2)}s`,
                                transform: `${lift}rotate(${p.rotate.toFixed(1)}deg)`,
                                opacity: isOn ? 1 : 0.16,
                                outline: isHovered && !liftOnHover ? "2px solid var(--foreground)" : undefined,
                                cursor: seat.href ? "pointer" : "default",
                                // Siège grisé : ni survol ni clic, la souris passe au travers
                                // (vers les sièges mis en avant, soulevés au-dessus).
                                pointerEvents: isOn ? undefined : "none",
                            };
                            const handlers = {
                                onMouseEnter: trackHover(i),
                                onMouseMove: trackHover(i),
                                onMouseLeave: () => setHover((h) => (h?.index === i ? null : h)),
                            };
                            // Lien natif hors tabulation : la liste nominative de la fiche sert d'accès clavier.
                            return seat.href ? (
                                <a key={seat.id} href={seat.href} tabIndex={-1} className="hemicycle-seat hemicycle-seat--hoverable" style={style} {...handlers} />
                            ) : (
                                <div key={seat.id} className="hemicycle-seat hemicycle-seat--hoverable" style={style} {...handlers} />
                            );
                        })}
                    </div>
                </div>

                {hover && hoveredSeat && (
                    <div
                        role="tooltip"
                        className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full flex items-center gap-3 rounded-md border py-2 pl-2 pr-3 text-sm shadow-lg whitespace-nowrap ${tooltipTheme ? "" : "border-main bg-surface-1"}`}
                        style={{
                            left: hover.x,
                            top: hover.y - 12,
                            ...(tooltipTheme && { background: tooltipTheme.background, color: tooltipTheme.text, borderColor: tooltipTheme.border }),
                        }}
                    >
                        {/* key : un avatar neuf par député, sinon une photo en erreur
                            garderait les initiales pour les sièges survolés ensuite. */}
                        <AvatarLib key={hoveredSeat.id} src={hoveredSeat.image} name={hoveredSeat.label} size="medium" />
                        <div>
                            <div className="font-semibold">{hoveredSeat.label}</div>
                            {hoveredSeat.sublabel && (
                                // Sur fond de groupe, la couleur secondaire du site ne serait pas
                                // lisible : on garde la couleur du texte, atténuée.
                                <div className={`text-xs ${tooltipTheme ? "opacity-85" : "text-subtitle-accent"}`}>{hoveredSeat.sublabel}</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {legend.length > 0 && (
                <ScrutinHemicycleLegend
                    legend={legend}
                    highlight={highlight}
                    onToggle={(key) => setHighlight((h) => (h === key ? null : key))}
                />
            )}
        </div>
    );
}

/**
 * Légende du scrutin : barre de répartition proportionnelle, puis une puce par position
 * (couleur, libellé, nombre, part). Cliquer une puce met la position en avant sur le plan.
 */
function ScrutinHemicycleLegend({
    legend,
    highlight,
    onToggle,
}: {
    legend: HemicycleLegendItem[];
    highlight: string | null;
    onToggle: (key: string) => void;
}) {
    const total = legend.reduce((sum, item) => sum + (item.count ?? 0), 0);
    const part = (count = 0) => (total > 0 ? (count / total) * 100 : 0);

    return (
        <div className="flex flex-col items-center gap-3">
            {total > 0 && (
                <div className="flex h-2.5 w-full max-w-md overflow-hidden rounded-full bg-surface-3" aria-hidden="true">
                    {legend.map((item) => (
                        <div
                            key={item.key}
                            className="h-full transition-opacity duration-200"
                            style={{
                                width: `${part(item.count)}%`,
                                background: item.color,
                                opacity: highlight === null || highlight === item.key ? 1 : 0.25,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Légende du vote">
                {legend.map((item) => {
                    const active = highlight === item.key;
                    const dimmed = highlight !== null && !active;
                    return (
                        <button
                            key={item.key}
                            type="button"
                            aria-pressed={active}
                            onClick={() => onToggle(item.key)}
                            className="inline-flex items-center gap-2 rounded-full border border-main bg-surface-2 px-3 py-1 text-sm transition hover:bg-surface-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            style={{
                                opacity: dimmed ? 0.5 : 1,
                                boxShadow: active ? `inset 0 0 0 2px ${item.color}` : undefined,
                            }}
                        >
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
                            <span className="font-medium">{item.label}</span>
                            {item.count !== undefined && (
                                <span className="tabular-nums text-subtitle-accent">
                                    {item.count}
                                    {total > 0 && <span className="text-xs"> · {Math.round(part(item.count))} %</span>}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
