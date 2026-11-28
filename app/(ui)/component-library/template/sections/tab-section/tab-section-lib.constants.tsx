import React from "react";
import { BarChart3, Users, Vote } from "lucide-react";
import { WireBox, WireLabel } from "@/app/(ui)/component-library/template/debug/wireframe/wire-frame.utils";
import { AnchorSection } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";
import { TabSectionProvider } from "@/app/(ui)/component-library/template/sections/tab-section/tab-section-provider";
import { TabBarLib } from "@/app/(ui)/component-library/template/sections/tab-section/tab-bar-lib";
import { TabPanelLib } from "@/app/(ui)/component-library/template/sections/tab-section/tab-panel-lib";

const DEMO_SECTIONS: AnchorSection[] = [
    { id: "demo-tab-demographie", label: "Démographie", icon: Users },
    { id: "demo-tab-votes", label: "Votes", icon: Vote },
    { id: "demo-tab-activite", label: "Activité", icon: BarChart3 },
];

// Rendu réel : la barre d'onglets et un panneau par section.
const TabsDemo = () => (
    <div className="w-full">
        <TabSectionProvider ids={DEMO_SECTIONS.map((s) => s.id)}>
            <TabBarLib sections={DEMO_SECTIONS} label="Sections de la démo" />
            {DEMO_SECTIONS.map((s) => (
                <TabPanelLib key={s.id} id={s.id}>
                    <WireBox label={`Section « ${s.label} »`} height="h-24" />
                </TabPanelLib>
            ))}
        </TabSectionProvider>
    </div>
);

const WireframeTabLayout = () => (
    <div className="w-full border border-main rounded-lg overflow-hidden" style={{ borderStyle: "dashed" }}>
        <div className="px-4 py-3 border-b border-main" style={{ borderStyle: "dashed", backgroundColor: "var(--surface-2)" }}>
            <WireLabel>header (custom) ou PageHeaderLib — toujours visible</WireLabel>
        </div>
        <div className="px-4 pt-3 flex gap-4 border-b border-main" style={{ borderStyle: "dashed" }}>
            {["Section 1", "Section 2", "Section 3"].map((s, i) => (
                <div
                    key={s}
                    className="pb-2 text-xs font-semibold"
                    style={{
                        color: i === 0 ? "var(--accent)" : "var(--subtitle-accent)",
                        boxShadow: i === 0 ? "inset 0 -2px 0 var(--accent)" : undefined,
                    }}
                >
                    {s}
                </div>
            ))}
        </div>
        <div className="p-4 flex flex-col gap-2">
            <WireLabel>TabPanelLib de l&apos;onglet ouvert, pleine largeur (les autres sont masqués)</WireLabel>
            <div className="grid grid-cols-4 gap-2">
                <WireBox label="Block" height="h-10" />
                <WireBox label="Block" height="h-10" />
                <WireBox label="Block" height="h-10" />
                <WireBox label="Block" height="h-10" />
            </div>
        </div>
    </div>
);

const CODE_TAB_LAYOUT = `
<TabLayout header={<DeputeHeader identity={identity} />} sections={SECTIONS} tabsLabel="Fiche du député">
    {SECTIONS.map((section) => (
        <TabPanelLib key={section.id} id={section.id}>
            <SectionBlockLoader section={section} params={params} onReady={onReady} />
        </TabPanelLib>
    ))}
</TabLayout>`;

const CODE_TAB_BAR = `
<TabSectionProvider ids={sections.map((s) => s.id)}>
    <TabBarLib sections={sections} label="Sections" />
    {sections.map((s) => (
        <TabPanelLib key={s.id} id={s.id}>…</TabPanelLib>
    ))}
</TabSectionProvider>`;

export const getTabSectionLibSections = () => [
    {
        title: "TabLayout — Structure globale",
        description:
            "Header pleine largeur toujours visible, barre d'onglets, puis une section à la fois sur toute la largeur. " +
            "Pour une page trop longue en défilement (à comparer à AnchorLayout). Mêmes sections (PageSection) que les " +
            "autres templates. Utilisé par la fiche député.",
        code: CODE_TAB_LAYOUT,
        component: <WireframeTabLayout />,
    },
    {
        title: "TabBarLib + TabPanelLib — Onglets",
        description:
            "Rendu réel. Motif ARIA « tabs » : flèches (en boucle), Début, Fin. Les sections restent montées (données " +
            "chargées une fois, changement d'onglet instantané). L'onglet ouvert est gardé dans l'URL (#section) et un " +
            "lien direct l'ouvre. Doit être dans un TabSectionProvider (fourni par TabLayout).",
        code: CODE_TAB_BAR,
        component: <TabsDemo />,
    },
];
