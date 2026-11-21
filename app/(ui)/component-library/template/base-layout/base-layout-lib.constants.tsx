import React from "react";
import { WireBox, WireLabel } from "@/app/(ui)/component-library/template/debug/wireframe/wire-frame.utils";

/*
 * Wireframe plutôt que rendu réel : BaseLayout prend toute la hauteur de
 * l'écran (`min-h-screen`), il déborderait du cadre de la démo.
 */
const WireframeBaseLayout = () => (
    <div className="w-full border border-main rounded-lg p-2" style={{ borderStyle: "dashed", backgroundColor: "var(--surface-2)" }}>
        <div className="mb-2"><WireLabel>BaseLayout · min-h-screen, fond de page</WireLabel></div>
        <div className="mx-auto max-w-2xl border border-main rounded p-4 flex flex-col gap-3" style={{ borderStyle: "dashed" }}>
            <WireLabel>max-w-screen-2xl · marges responsives (px-4 → px-8)</WireLabel>
            <WireBox label="PageHeaderLib" height="h-10" />
            <WireBox label="children" height="h-24" />
        </div>
    </div>
);

const CODE_BASE_LAYOUT = `<BaseLayout>
    <PageHeaderLib title="Groupes" subtitle="Les groupes parlementaires" />
    {/* contenu de la page */}
</BaseLayout>`;

export const getBaseLayoutSections = () => [
    {
        title: "Structure",
        description: "Conteneur de page : fond, largeur maximale centrée et marges responsives. Utilisé par les pages de vue (groupes, scrutins, statistiques…) et par AnchorLayout.",
        code: CODE_BASE_LAYOUT,
        component: <WireframeBaseLayout />,
    },
];
