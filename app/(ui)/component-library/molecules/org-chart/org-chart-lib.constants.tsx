import React from "react";
import { OrgChartLib, OrgChartNode } from "@/app/(ui)/component-library/molecules/org-chart/org-chart-lib";

const ROOT: OrgChartNode = {
    id: "direction",
    title: "Direction",
    subtitle: "Présidence",
    children: [
        {
            id: "pole-a",
            title: "Pôle A",
            subtitle: "Responsable : Alice Martin",
            href: "#",
            children: [
                { id: "a1", title: "Bruno Petit", subtitle: "Adjoint" },
                { id: "a2", title: "Chloé Roux", subtitle: "Adjointe", note: "jusqu'au 01/03/2026" },
            ],
        },
        {
            id: "pole-b",
            variant: "group",
            title: "Pôle B (intitulé de regroupement)",
            subtitle: "6",
            children: ["David", "Emma Lefebvre-Desmarais", "Farid", "Gaëlle", "Hugo", "Inès"].map((p, i) => ({
                id: `b${i}`,
                title: p,
                subtitle: i === 1 ? "Membre chargée d'une fonction à l'intitulé particulièrement long" : "Membre",
                avatar: { src: null },
                badge: { label: i % 2 ? "ABC" : "DE", background: "var(--surface-3)", color: "var(--foreground)", title: "Équipe" },
            })),
        },
    ],
};

const CODE = `<OrgChartLib root={{
  id: "direction", title: "Direction", subtitle: "Présidence",
  children: [
    { id: "pole-a", title: "Pôle A", href: "/…", children: [{ id: "a1", title: "Bruno Petit", subtitle: "Adjoint" }] },
    …
  ],
}} />
`;

export const getOrgChartSections = () => [
    {
        title: "Arbre hiérarchique (au-delà de 3 feuilles : grille compacte ; variant « group » : intitulé sans carte)",
        code: CODE,
        component: <OrgChartLib root={ROOT} />,
    },
];
