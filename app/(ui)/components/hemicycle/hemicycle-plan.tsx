"use client";

import React, { useRef, useState } from "react";
import { HemicycleSeat } from "@/app/(ui)/components/hemicycle/hemicycle-seats";
import { getCanonicalGroupCode, getGroupCardTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import { HemicyclePerchoir, ROLE_PERCHOIR } from "@/app/(ui)/_shared/adapter/hemicycle.adapter";
import DeputyCard from "@/app/(ui)/components/deputy/deputy-card";

type HemicyclePlanProps = {
    seats: HemicycleSeat[];
    selectedCode: string | null;
    /** Présidence de l'Assemblée : sa carte s'affiche au survol (ou au focus) du perchoir. */
    perchoir?: HemicyclePerchoir | null;
};

/** Point d'ancrage de la carte du perchoir, relatif au conteneur du plan. */
type Ancre = { x: number; y: number };

/**
 * Plan des sièges incliné en 3D. Les sièges sont décoratifs (vides) : la
 * légende, avec ses effectifs, sert d'alternative textuelle. Chaque siège porte
 * `data-group` / `data-rank`, prévus pour la future concordance siège ↔ député.
 * Le perchoir est un lien vers la fiche de la présidence, nommé pour les
 * lecteurs d'écran, qui affiche sa carte au survol ou au focus.
 */
export function HemicyclePlan({ seats, selectedCode, perchoir = null }: HemicyclePlanProps) {
    const total = seats.length;
    const containerRef = useRef<HTMLDivElement>(null);
    const [ancre, setAncre] = useState<Ancre | null>(null);

    // Le plan est incliné en 3D : la carte suit la souris plutôt que la position
    // (déformée par la perspective) du siège ; au clavier, elle se cale sur le siège.
    const suivreSouris = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) setAncre({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const caleSurSiege = (e: React.FocusEvent<HTMLElement>) => {
        const rect = containerRef.current?.getBoundingClientRect();
        const siege = e.currentTarget.getBoundingClientRect();
        if (rect) setAncre({ x: siege.left + siege.width / 2 - rect.left, y: siege.top - rect.top });
    };

    return (
        <div ref={containerRef} className="relative">
            <div className="hemicycle-stage">
                <div className="hemicycle-plane">
                    <div className="hemicycle-glow" aria-hidden="true" />
                    {seats.map((seat) => {
                        const theme = getGroupCardTheme(getCanonicalGroupCode(seat.groupeCode));
                        const isOn = !selectedCode || selectedCode === seat.groupeCode;
                        const lift = selectedCode && isOn ? "translateZ(26px) " : "";
                        const style: React.CSSProperties = {
                            left: `${seat.left.toFixed(2)}%`,
                            top: `${seat.top.toFixed(2)}%`,
                            background: `linear-gradient(160deg, ${theme.bg[0]}, ${theme.bg[1]})`,
                            animationDelay: `${((seat.index / total) * 1.4).toFixed(2)}s`,
                            transform: `${lift}rotate(${seat.rotate.toFixed(1)}deg)`,
                            opacity: isOn ? 1 : 0.16,
                        };
                        const attributs = {
                            "data-group": seat.groupeCode,
                            "data-rank": seat.rank,
                        };

                        if (seat.perchoir && perchoir) {
                            return (
                                <a
                                    key={`${seat.groupeCode}-${seat.rank}`}
                                    href={`/deputes/${perchoir.carte.deputeUID}`}
                                    aria-label={`${ROLE_PERCHOIR} : ${perchoir.carte.deputeFullName}`}
                                    className="hemicycle-seat hemicycle-seat--perchoir"
                                    data-perchoir="true"
                                    style={style}
                                    onMouseEnter={suivreSouris}
                                    onMouseMove={suivreSouris}
                                    onMouseLeave={() => setAncre(null)}
                                    onFocus={caleSurSiege}
                                    onBlur={() => setAncre(null)}
                                    {...attributs}
                                />
                            );
                        }

                        return (
                            <div
                                key={`${seat.groupeCode}-${seat.rank}`}
                                className={`hemicycle-seat${seat.perchoir ? " hemicycle-seat--perchoir" : ""}`}
                                aria-hidden="true"
                                style={style}
                                {...attributs}
                            />
                        );
                    })}
                </div>
            </div>

            {perchoir && ancre && (
                // Aperçu passif (`inert` : ni focus ni lecteur d'écran) : le lien du perchoir
                // porte déjà le nom et mène à la fiche.
                <div
                    className="hemicycle-perchoir-card pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
                    style={{ left: ancre.x, top: ancre.y - 12 }}
                    inert
                    aria-hidden="true"
                    data-testid="hemicycle-perchoir-card"
                >
                    <DeputyCard
                        uid={perchoir.carte.deputeUID}
                        nom={perchoir.carte.deputeFullName}
                        groupe={perchoir.carte.deputeGroupeCode}
                        image={perchoir.carte.deputeImage}
                        role={ROLE_PERCHOIR}
                    />
                </div>
            )}
        </div>
    );
}
