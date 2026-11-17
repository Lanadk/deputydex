"use client";

import React from "react";
import { HemicycleSeat } from "@/app/(ui)/components/hemicycle/hemicycle-seats";
import { getCanonicalGroupCode, getGroupCardTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";

type HemicyclePlanProps = {
    seats: HemicycleSeat[];
    selectedCode: string | null;
};

/**
 * Plan des sièges incliné en 3D. Décoratif (`aria-hidden`) : la légende, avec
 * ses effectifs, sert d'alternative textuelle. Chaque siège porte
 * `data-group` / `data-rank`, prévus pour la future concordance siège ↔ député.
 */
export function HemicyclePlan({ seats, selectedCode }: HemicyclePlanProps) {
    const total = seats.length;

    return (
        <div className="hemicycle-stage" aria-hidden="true">
            <div className="hemicycle-plane">
                <div className="hemicycle-glow" />
                {seats.map((seat) => {
                    const theme = getGroupCardTheme(getCanonicalGroupCode(seat.groupeCode));
                    const isOn = !selectedCode || selectedCode === seat.groupeCode;
                    const lift = selectedCode && isOn ? "translateZ(26px) " : "";

                    return (
                        <div
                            key={`${seat.groupeCode}-${seat.rank}`}
                            className="hemicycle-seat"
                            data-group={seat.groupeCode}
                            data-rank={seat.rank}
                            style={{
                                left: `${seat.left.toFixed(2)}%`,
                                top: `${seat.top.toFixed(2)}%`,
                                background: `linear-gradient(160deg, ${theme.bg[0]}, ${theme.bg[1]})`,
                                animationDelay: `${((seat.index / total) * 1.4).toFixed(2)}s`,
                                transform: `${lift}rotate(${seat.rotate.toFixed(1)}deg)`,
                                opacity: isOn ? 1 : 0.16,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
