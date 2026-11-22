"use client"

import { ThemeSwitcherLib } from "@/app/(ui)/component-library/molecules/theme-switcher/theme-switcher-lib";

export const THEME_SWITCHER_CODE_DEFAULT = `// Dans la barre latérale (app-sidebar.tsx), avec le style de ses liens
<ThemeSwitcherLib
  label={isOpen ? "Thème" : undefined}
  triggerClassName="flex items-center gap-3 px-2.5 py-2.5 rounded-lg sidebar-link w-full"
/>`;

export const THEME_SWITCHER_CODE_COMPACT = `// Icône seule (barre repliée), panneau ouvert vers le haut
<ThemeSwitcherLib side="top" triggerClassName="sidebar-link p-2.5 rounded-lg" />`;

const TRIGGER = "flex items-center gap-3 px-2.5 py-2.5 rounded-lg sidebar-link";

export const getThemeSwitcherSections = () => [
    {
        title: "Avec libellé (barre latérale ouverte)",
        description: "Cliquez pour ouvrir le panneau. Le choix s'applique à tout le site, comme le sélecteur de la barre latérale.",
        code: THEME_SWITCHER_CODE_DEFAULT,
        component: (
            <div className="flex h-64 items-end">
                <ThemeSwitcherLib label="Thème" side="top" triggerClassName={TRIGGER} />
            </div>
        ),
    },
    {
        title: "Icône seule (barre latérale repliée)",
        code: THEME_SWITCHER_CODE_COMPACT,
        component: (
            <div className="flex h-64 items-end">
                <ThemeSwitcherLib side="top" triggerClassName="sidebar-link p-2.5 rounded-lg" />
            </div>
        ),
    },
];
