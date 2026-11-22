"use client";

import React, { useState } from "react";
import { TabsLib, tabPanelProps, TabsLibVariant } from "@/app/(ui)/component-library/molecules/tabs/tabs-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

const DEMO_TABS = [
    { id: "direct", label: "En direct" },
    { id: "requetes", label: "Requêtes", badge: 24 },
    { id: "pages", label: "Pages", badge: 5 },
];

function TabsDemo({ withBadges, variant = "underline", fullWidth = false }: { withBadges: boolean; variant?: TabsLibVariant; fullWidth?: boolean }) {
    const [active, setActive] = useState("direct");
    const tabs = withBadges ? DEMO_TABS : DEMO_TABS.map(({ id, label }) => ({ id, label }));
    const prefix = `demo-${variant}-${withBadges ? "badges" : "simple"}${fullWidth ? "-full" : ""}`;
    return (
        <div className="flex flex-col gap-3">
            <TabsLib tabs={tabs} activeId={active} onChange={setActive} ariaLabel="Démo d'onglets" idPrefix={prefix} variant={variant} fullWidth={fullWidth} />
            <div {...tabPanelProps(prefix, active)} className="rounded border border-main p-4">
                <SpanLib>Contenu de l&apos;onglet « {tabs.find((t) => t.id === active)?.label} »</SpanLib>
            </div>
        </div>
    );
}

const CODE_SIMPLE = `const [active, setActive] = useState("direct");

<TabsLib
  tabs={[{ id: "direct", label: "En direct" }, { id: "requetes", label: "Requêtes" }]}
  activeId={active}
  onChange={setActive}
  ariaLabel="Vues de la page"
  idPrefix="perf"
/>
<div {...tabPanelProps("perf", active)}>…</div>`;

const CODE_BADGES = `<TabsLib
  tabs={[{ id: "requetes", label: "Requêtes", badge: 24 }, { id: "pages", label: "Pages", badge: 5 }]}
  …
/>`;

const CODE_SEGMENTED = `<TabsLib
  tabs={[{ id: "assemblee", label: "Assemblée nationale" }, { id: "executif", label: "Exécutif" }]}
  activeId={active}
  onChange={setActive}
  ariaLabel="Institution présentée"
  idPrefix="institutions"
  variant="segmented"
/>`;

const CODE_FULL_WIDTH = `<TabsLib
  tabs={[{ id: "assemblee", label: "Assemblée nationale" }, { id: "executif", label: "Exécutif" }]}
  …
  variant="segmented"
  fullWidth
/>`;

export const getTabsSections = () => [
    {
        title: "Onglets simples",
        description: "Clic ou clavier : flèches gauche / droite, Début / Fin. Un seul onglet dans l'ordre de tabulation (motif ARIA « tabs »).",
        code: CODE_SIMPLE,
        component: <TabsDemo withBadges={false} />,
    },
    {
        title: "Avec pastilles",
        description: "Une pastille après le libellé, par exemple un nombre d'éléments.",
        code: CODE_BADGES,
        component: <TabsDemo withBadges />,
    },
    {
        title: "Variante « segmented »",
        description: "Sélecteur en pastilles, onglet actif rempli. Pour distinguer un niveau d'onglets d'un autre niveau souligné sur la même page (ex. institution / gouvernement sur la page Législatures). Même comportement clavier.",
        code: CODE_SEGMENTED,
        component: <TabsDemo withBadges={false} variant="segmented" />,
    },
    {
        title: "Pleine largeur",
        description: "`fullWidth` : la liste occupe toute la largeur, chaque onglet en part égale (deux onglets = deux moitiés). Combinable avec les deux variantes.",
        code: CODE_FULL_WIDTH,
        component: <TabsDemo withBadges={false} variant="segmented" fullWidth />,
    },
];
