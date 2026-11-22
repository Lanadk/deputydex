import React from "react";
import { TimelineLane, TimelineLib } from "@/app/(ui)/component-library/molecules/timeline/timeline-lib";
import { FriseCouloirId, LegislaturesFriseDTO } from "@/app/domains/legislatures/dto/legislatures-frise.dto";

/** Couleur de chaque couloir : palette des graphiques, dans l'ordre. */
const COULEUR_COULOIR: Record<FriseCouloirId, string> = {
    presidence: "var(--chart-1)",
    legislatures: "var(--chart-2)",
    gouvernements: "var(--chart-3)",
    assemblee: "var(--chart-4)",
};

/** Frise des législatures : Présidence, législatures, gouvernements, présidence de l'Assemblée. */
export function LegislaturesFrise({ frise }: { frise: LegislaturesFriseDTO }) {
    const lanes: TimelineLane[] = frise.couloirs.map((c) => ({
        id: c.id,
        label: c.libelle,
        color: COULEUR_COULOIR[c.id],
        periods: c.periodes.map((p) => ({ id: p.id, label: p.libelle, detail: p.detail, start: p.debut, end: p.fin, href: p.href })),
    }));

    return (
        <TimelineLib
            start={frise.debut}
            end={frise.fin}
            lanes={lanes}
            events={frise.evenements.map((e) => ({ date: e.date, label: e.libelle }))}
            ariaLabel="Frise chronologique des législatures et des institutions"
        />
    );
}
