"use client";

import React, { useState } from "react";
import { TabsLib, tabPanelProps } from "@/app/(ui)/component-library/molecules/tabs/tabs-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

const DEMO_TABS = [
    { id: "direct", label: "En direct" },
    { id: "requetes", label: "Requêtes", badge: 24 },
    { id: "pages", label: "Pages", badge: 5 },
];

function TabsDemo({ withBadges }: { withBadges: boolean }) {
    const [active, setActive] = useState("direct");
    const tabs = withBadges ? DEMO_TABS : DEMO_TABS.map(({ id, label }) => ({ id, label }));
    const prefix = withBadges ? "demo-badges" : "demo-simple";
    return (
        <div className="flex flex-col gap-3">
            <TabsLib tabs={tabs} activeId={active} onChange={setActive} ariaLabel="Démo d'onglets" idPrefix={prefix} />
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
];
