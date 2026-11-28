"use client";

import React, { useEffect, useRef, useState } from "react";
import { HemicycleSeat } from "@/app/(ui)/components/hemicycle/hemicycle-seats";
import { getCanonicalGroupCode, getGroupCardTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import { HemicyclePerchoir, ROLE_PERCHOIR } from "@/app/(ui)/_shared/adapter/hemicycle.adapter";
import { HabillageSiege } from "@/app/(ui)/components/hemicycle/hemicycle-indicateurs";

type HemicyclePlanProps = {
    seats: HemicycleSeat[];
    /** Groupes mis en relief (un groupe, ou une coalition) ; vide = tous. */
    selectedCodes: string[];
    /** Habillage par `seat.index` (député en info-bulle, couleur d'un indicateur) ; couleur du groupe à défaut. */
    habillage?: Map<number, HabillageSiege>;
    /** Présidence de l'Assemblée : son nom et son titre s'affichent au survol (ou au focus) du perchoir. */
    perchoir?: HemicyclePerchoir | null;
};

/** Point d'ancrage du libellé du perchoir (milieu du bas du siège), relatif au conteneur du plan. */
type Ancre = { x: number; y: number };

/**
 * Délai avant de masquer le libellé quand la souris quitte le perchoir : le
 * survol d'un élément incliné en 3D est imprécis sur ses bords, une sortie
 * suivie d'un retour immédiat ne doit pas faire clignoter le libellé.
 */
const DELAI_MASQUAGE_MS = 150;

/**
 * Plan des sièges incliné en 3D. Les sièges sont décoratifs : la légende, avec
 * ses effectifs (et l'échelle d'un indicateur), sert d'alternative textuelle ;
 * l'info-bulle native (`habillage`) nomme le député au survol. Chaque siège porte
 * `data-group` / `data-rank`. Le perchoir est un lien vers la fiche de la
 * présidence, nommé pour les lecteurs d'écran, qui affiche son nom et son titre
 * sous le siège au survol ou au focus.
 */
export function HemicyclePlan({ seats, selectedCodes, habillage, perchoir = null }: HemicyclePlanProps) {
    const total = seats.length;
    const containerRef = useRef<HTMLDivElement>(null);
    const masquage = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [ancre, setAncre] = useState<Ancre | null>(null);

    const annuleMasquage = () => {
        if (masquage.current) clearTimeout(masquage.current);
        masquage.current = null;
    };
    useEffect(() => annuleMasquage, []);

    // Ancre fixe, calée une fois sur le siège (sa boîte projetée à l'écran) :
    // le libellé ne bouge pas avec la souris.
    const afficher = (e: React.SyntheticEvent<HTMLElement>) => {
        annuleMasquage();
        const rect = containerRef.current?.getBoundingClientRect();
        const siege = e.currentTarget.getBoundingClientRect();
        if (rect) setAncre({ x: siege.left + siege.width / 2 - rect.left, y: siege.bottom - rect.top });
    };
    const masquerApresDelai = () => {
        annuleMasquage();
        masquage.current = setTimeout(() => setAncre(null), DELAI_MASQUAGE_MS);
    };
    const masquer = () => {
        annuleMasquage();
        setAncre(null);
    };

    return (
        <div ref={containerRef} className="relative">
            <div className="hemicycle-stage">
                <div className="hemicycle-plane">
                    <div className="hemicycle-glow" aria-hidden="true" />
                    {seats.map((seat) => {
                        const theme = getGroupCardTheme(getCanonicalGroupCode(seat.groupeCode));
                        const habit = habillage?.get(seat.index);
                        const enRelief = selectedCodes.length > 0;
                        const isOn = !enRelief || selectedCodes.includes(seat.groupeCode);
                        const lift = enRelief && isOn ? "translateZ(26px) " : "";
                        const style: React.CSSProperties = {
                            left: `${seat.left.toFixed(2)}%`,
                            top: `${seat.top.toFixed(2)}%`,
                            background: habit?.background ?? `linear-gradient(160deg, ${theme.bg[0]}, ${theme.bg[1]})`,
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
                                    onMouseEnter={afficher}
                                    onMouseLeave={masquerApresDelai}
                                    onFocus={afficher}
                                    onBlur={masquer}
                                    {...attributs}
                                />
                            );
                        }

                        return (
                            <div
                                key={`${seat.groupeCode}-${seat.rank}`}
                                className={`hemicycle-seat${seat.perchoir ? " hemicycle-seat--perchoir" : ""}${habit?.peuFiable ? " hemicycle-seat--peu-fiable" : ""}`}
                                aria-hidden="true"
                                title={habit?.title}
                                style={style}
                                {...attributs}
                            />
                        );
                    })}
                </div>
            </div>

            {perchoir && ancre && (
                // Libellé passif (`inert` : ni focus ni lecteur d'écran) : le lien du perchoir
                // porte déjà le nom et mène à la fiche.
                <div
                    className="hemicycle-perchoir-label"
                    style={{ left: ancre.x, top: ancre.y + 8 }}
                    inert
                    aria-hidden="true"
                    data-testid="hemicycle-perchoir-label"
                >
                    <span className="hemicycle-perchoir-label__nom">{perchoir.carte.deputeFullName}</span>
                    <span className="hemicycle-perchoir-label__titre">{ROLE_PERCHOIR}</span>
                </div>
            )}
        </div>
    );
}
