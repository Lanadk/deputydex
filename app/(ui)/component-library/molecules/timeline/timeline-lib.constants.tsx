import React from "react";
import { TimelineLane, TimelineLib } from "@/app/(ui)/component-library/molecules/timeline/timeline-lib";

const LANES: TimelineLane[] = [
    {
        id: "mandats",
        label: "Mandats",
        color: "var(--chart-1)",
        periods: [{ id: "m1", label: "Mandat en cours", detail: "2e mandat", start: "2022-05-14", end: null }],
    },
    {
        id: "equipes",
        label: "Équipes",
        color: "var(--chart-2)",
        periods: [
            { id: "e1", label: "Équipe A", start: "2022-05-17", end: "2024-01-08" },
            { id: "e2", label: "Équipe B", start: "2024-01-09", end: "2024-09-04" },
            { id: "e3", label: "Équipe C", start: "2024-09-05", end: "2024-12-12" },
            { id: "e4", label: "Équipe D", start: "2024-12-13", end: null, href: "#" },
        ],
    },
    {
        id: "cycles",
        label: "Cycles",
        color: "var(--chart-3)",
        periods: [
            { id: "c1", label: "Cycle 1", start: "2022-06-28", end: "2024-06-09" },
            { id: "c2", label: "Cycle 2", start: "2024-07-18", end: null },
        ],
    },
];

const CODE = `<TimelineLib
  start="2022-05-01" end="2026-11-22"
  lanes={[
    { id: "equipes", label: "Équipes", color: "var(--chart-2)",
      periods: [{ id: "e1", label: "Équipe A", start: "2022-05-17", end: "2024-01-08" }, …] },
    …
  ]}
  events={[{ date: "2024-06-09", label: "Interruption" }]}
/>
`;

export const getTimelineSections = () => [
    {
        title: "Couloirs parallèles, périodes à l'échelle, événements",
        code: CODE,
        component: (
            <TimelineLib
                start="2022-05-01"
                end="2026-11-22"
                lanes={LANES}
                events={[{ date: "2024-06-09", label: "Interruption" }]}
                ariaLabel="Exemple de frise"
            />
        ),
    },
];
