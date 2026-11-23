"use client"

import React from "react";
import { ScrollHintLib } from "@/app/(ui)/component-library/molecules/scroll-hint/scroll-hint-lib";

export const SCROLL_HINT_CODE = `<ScrollHintLib target="suite" label="Défiler pour la suite" />

<section id="suite">…</section>
`;

export const getScrollHintSections = () => [
    {
        title: "Usage basique (cliquer : défilement doux jusqu'à la cible)",
        code: SCROLL_HINT_CODE,
        component: (
            <div className="flex flex-col items-center gap-6">
                <ScrollHintLib target="scroll-hint-demo-cible" label="Défiler pour la suite" />
                <div id="scroll-hint-demo-cible" className="w-full rounded-lg border border-main bg-surface-2 p-4 text-sm">
                    Cible du défilement
                </div>
            </div>
        ),
    },
];
