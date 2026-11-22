import React from "react";
import { ProportionBarLib } from "@/app/(ui)/component-library/molecules/proportion-bar/proportion-bar-lib";

const SEGMENTS = [
    { id: "a", label: "Catégorie A", value: 42, color: "var(--chart-1)" },
    { id: "b", label: "Catégorie B", value: 27, color: "var(--chart-2)" },
    { id: "c", label: "Catégorie C", value: 21, color: "var(--chart-3)" },
    { id: "d", label: "Catégorie D", value: 9, color: "var(--chart-4)" },
    { id: "e", label: "Catégorie E", value: 4, color: "var(--chart-5)" },
];

const CODE = `<ProportionBarLib
  ariaLabel="Répartition des 103 éléments par catégorie"
  segments={[
    { id: "a", label: "Catégorie A", value: 42, color: "var(--chart-1)" },
    { id: "b", label: "Catégorie B", value: 27, color: "var(--chart-2)" },
    …
  ]}
/>
`;

export const getProportionBarSections = () => [
    {
        title: "Répartition d'un total : barre segmentée et légende (valeur, pourcentage)",
        code: CODE,
        component: <ProportionBarLib segments={SEGMENTS} ariaLabel="Répartition des 103 éléments par catégorie" />,
    },
];
