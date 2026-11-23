"use client"

import React from "react";
import { Home, Settings, Vote } from "lucide-react";
import { TooltipLib } from "@/app/(ui)/component-library/molecules/tooltip/tooltip-lib";

export const TOOLTIP_CODE = `<TooltipLib content="Accueil" placement="right">
    <a href="/" aria-label="Accueil"><Home /></a>
</TooltipLib>
`;

export const TOOLTIP_PLACEMENT_CODE = `<TooltipLib content="Au-dessus">…</TooltipLib>          // placement="top" par défaut
<TooltipLib content="À droite" placement="right">…</TooltipLib>
<TooltipLib content="En dessous" placement="bottom">…</TooltipLib>
<TooltipLib content="À gauche" placement="left">…</TooltipLib>
`;

export const TOOLTIP_DISABLED_CODE = `// Menu déplié : le libellé est visible, pas besoin de bulle.
<TooltipLib content="Scrutins" disabled={isOpen} placement="right">…</TooltipLib>
`;

const bouton = "inline-flex items-center justify-center rounded-lg border border-main bg-surface-2 px-3 py-2 text-sm";

export const getTooltipSections = () => [
    {
        title: "Icône seule : survoler, ou y aller avec Tab (Échap ferme la bulle)",
        code: TOOLTIP_CODE,
        component: (
            <div className="flex gap-3">
                <TooltipLib content="Accueil" placement="right">
                    <a href="#" aria-label="Accueil" className={bouton}><Home size={18} aria-hidden="true" /></a>
                </TooltipLib>
                <TooltipLib content="Scrutins" placement="right">
                    <a href="#" aria-label="Scrutins" className={bouton}><Vote size={18} aria-hidden="true" /></a>
                </TooltipLib>
                <TooltipLib content="Réglages" placement="right">
                    <button type="button" aria-label="Réglages" className={bouton}><Settings size={18} aria-hidden="true" /></button>
                </TooltipLib>
            </div>
        ),
    },
    {
        title: "Les quatre côtés",
        code: TOOLTIP_PLACEMENT_CODE,
        component: (
            <div className="flex flex-wrap gap-3 py-8">
                <TooltipLib content="Au-dessus"><button type="button" className={bouton}>top</button></TooltipLib>
                <TooltipLib content="À droite" placement="right"><button type="button" className={bouton}>right</button></TooltipLib>
                <TooltipLib content="En dessous" placement="bottom"><button type="button" className={bouton}>bottom</button></TooltipLib>
                <TooltipLib content="À gauche" placement="left"><button type="button" className={bouton}>left</button></TooltipLib>
            </div>
        ),
    },
    {
        title: "disabled : pas de bulle (ici, comme dans un menu déplié)",
        code: TOOLTIP_DISABLED_CODE,
        component: (
            <TooltipLib content="Scrutins" disabled placement="right">
                <a href="#" className={bouton}><Vote size={18} aria-hidden="true" /> <span className="ml-2">Scrutins</span></a>
            </TooltipLib>
        ),
    },
];
