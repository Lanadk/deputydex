"use client";

import React, { useState } from "react";
import { OrgChartLib, OrgChartNode } from "@/app/(ui)/component-library/molecules/org-chart/org-chart-lib";
import { TabsLib, tabPanelProps } from "@/app/(ui)/component-library/molecules/tabs/tabs-lib";

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
            info: { subject: "Responsable de pôle", content: "Encadre le pôle et rend compte à la direction." },
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
            info: { subject: "Pôle B", content: "Bulle d'information (champ info) : ici, la définition du regroupement." },
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
    { id: "pole-b", variant: "group", title: "Pôle B", info: { subject: "Pôle B", content: "Définition…" }, children: […] },
    …
  ],
}} />
`;

const CODE_TOOLBAR = `<OrgChartLib
  root={root}
  showExpandControls
  toolbar={<TabsLib tabs={…} activeId={…} onChange={…} ariaLabel="Périodes" idPrefix="periodes" />}
  treeProps={tabPanelProps("periodes", active)}
/>`;

const PERIODES = [
    { id: "p1", label: "Période 1" },
    { id: "p2", label: "Période 2" },
];

/** Onglets dans la barre, au-dessus des boutons « Tout déplier / replier ». */
function OrgChartToolbarDemo() {
    const [active, setActive] = useState("p1");
    return (
        <OrgChartLib
            root={{ ...ROOT, subtitle: PERIODES.find((p) => p.id === active)?.label }}
            showExpandControls
            toolbar={<TabsLib tabs={PERIODES} activeId={active} onChange={setActive} ariaLabel="Périodes" idPrefix="demo-org-periodes" />}
            treeProps={tabPanelProps("demo-org-periodes", active)}
        />
    );
}

const CODE_PYRAMIDE = `<OrgChartLib root={root} layout="pyramide" />

// Sélecteur « Arbre / Pyramide » ; contrôlé pour conserver le choix d'un onglet à l'autre :
const [layout, setLayout] = useState<OrgChartLayout>("arbre");
<OrgChartLib root={root} showExpandControls showLayoutToggle layout={layout} onLayoutChange={setLayout} />`;

export const getOrgChartSections = () => [
    {
        title: "Arbre hiérarchique (au-delà de 3 feuilles : grille compacte ; variant « group » : intitulé sans carte)",
        code: CODE,
        component: <OrgChartLib root={ROOT} />,
    },
    {
        title: "Contrôles et barre d'outils (toolbar au-dessus de « Tout déplier / replier » ; toolbar={null} : ligne réservée vide)",
        code: CODE_TOOLBAR,
        component: <OrgChartToolbarDemo />,
    },
    {
        title: "Affichage pyramidal (niveaux centrés ; feuilles d'un même parent en rangée) et sélecteur « Arbre / Pyramide »",
        code: CODE_PYRAMIDE,
        component: <OrgChartLib root={ROOT} layout="pyramide" showExpandControls showLayoutToggle />,
    },
];
