"use client"

import { ThemeSwitcherLib } from "@/app/(ui)/component-library/molecules/theme-switcher/theme-switcher-lib";

export const THEME_SWITCHER_CODE_DEFAULT = `// Monté une seule fois, dans le layout racine (app/layout.tsx),
// sous le ThemeProvider de next-themes.
<ThemeSwitcherLib />`;

/*
 * Le composant est en `position: fixed` (coin bas-droit de l'écran). Un parent
 * avec `transform` devient son bloc conteneur : la démo reste ainsi dans son
 * cadre au lieu de se superposer au sélecteur global de la page.
 */
const ThemeSwitcherFrame = () => (
    <div
        className="relative h-64 rounded-lg border border-main"
        style={{ transform: "translateZ(0)", borderStyle: "dashed" }}
    >
        <ThemeSwitcherLib />
    </div>
);

export const getThemeSwitcherSections = () => [
    {
        title: "Sélecteur de thème (Light, Dark, Accessible)",
        description: "Cliquez sur la palette pour ouvrir le panneau. Le choix s'applique à tout le site, comme le sélecteur global.",
        code: THEME_SWITCHER_CODE_DEFAULT,
        component: <ThemeSwitcherFrame />,
    },
];
