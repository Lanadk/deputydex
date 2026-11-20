import React from "react";
import { HemicycleLib, HemicycleLibLegendItem, HemicycleLibSeat } from "@/app/(ui)/component-library/molecules/hemicycle/hemicycle-lib";

const POSITIONS = [
    { key: "pour", label: "Pour", color: "#2563eb" },
    { key: "contre", label: "Contre", color: "#dc2626" },
    { key: "abstention", label: "Abstention", color: "#eab308" },
    { key: "absent", label: "Absent", color: "#d1d5db" },
];

/** 577 sièges de démonstration : la gauche vote pour, la droite contre, un centre partagé, des absents partout. */
function demoSeats(): HemicycleLibSeat[] {
    return Array.from({ length: 577 }, (_, i) => {
        const absent = (i * 7) % 5 === 0;
        const position = absent ? POSITIONS[3] : i < 250 ? POSITIONS[0] : i < 330 ? POSITIONS[i % 3 === 0 ? 2 : 0] : POSITIONS[1];
        return {
            id: `siege-${i}`,
            key: position.key,
            color: position.color,
            label: `Député n° ${i + 1}`,
            sublabel: `Groupe ${Math.floor(i / 60) + 1} · ${position.label}`,
        };
    });
}

function demoLegend(seats: HemicycleLibSeat[]): HemicycleLibLegendItem[] {
    return POSITIONS.map((p) => ({ ...p, count: seats.filter((s) => s.key === p.key).length }));
}

const SEATS = demoSeats();

export const HEMICYCLE_CODE_DEFAULT = `<HemicycleLib
  ariaLabel="Hémicycle du scrutin : 258 pour, 3 contre, 312 absents"
  seats={[
    // dans l'ordre de la salle, de la gauche vers la droite
    { id: "PA793532", key: "pour", color: "#2563eb",
      label: "Murielle Lepvraud", sublabel: "LFI-NFP · Pour", href: "/deputes/PA793532" },
    // …
  ]}
  legend={[
    { key: "pour", label: "Pour", color: "#2563eb", count: 258 },
    // …
  ]}
/>`;

export const HEMICYCLE_CODE_SMALL = `<HemicycleLib ariaLabel="Petit hémicycle" seats={seats.slice(0, 60)} />`;

export const getHemicycleSections = () => [
    {
        title: "577 sièges, info-bulle au survol, légende cliquable (met une catégorie en avant)",
        code: HEMICYCLE_CODE_DEFAULT,
        component: <HemicycleLib ariaLabel="Hémicycle de démonstration" seats={SEATS} legend={demoLegend(SEATS)} />,
    },
    {
        title: "Peu de sièges, sans légende (la taille des sièges s'adapte)",
        code: HEMICYCLE_CODE_SMALL,
        component: <HemicycleLib ariaLabel="Petit hémicycle de démonstration" seats={SEATS.slice(0, 60)} />,
    },
];
