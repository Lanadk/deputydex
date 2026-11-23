"use client"

import React from "react";
import { ScrollProgressLib } from "@/app/(ui)/component-library/molecules/scroll-progress/scroll-progress-lib";

export const SCROLL_PROGRESS_CODE = `<ScrollProgressLib
    sections={[
        { id: "accueil", label: "Accueil" },
        { id: "actu", label: "L'actu" },
        { id: "explorer", label: "Explorer" },
    ]}
/>

<section id="accueil">…</section>
<section id="actu">…</section>
<section id="explorer">…</section>
`;

const SECTIONS_DEMO = [
    { id: "scroll-progress-demo-1", label: "Première section" },
    { id: "scroll-progress-demo-2", label: "Deuxième section" },
    { id: "scroll-progress-demo-3", label: "Troisième section" },
];

export const getScrollProgressSections = () => [
    {
        title: "Dans le flux (fixed={false}) : suit le défilement de cette page ; survoler un point, cliquer pour y aller",
        code: SCROLL_PROGRESS_CODE,
        component: (
            <div className="flex items-start gap-6">
                <ScrollProgressLib sections={SECTIONS_DEMO} fixed={false} />
                <div className="flex flex-1 flex-col gap-3">
                    {SECTIONS_DEMO.map(({ id, label }) => (
                        <div key={id} id={id} className="rounded-lg border border-main bg-surface-2 p-4 text-sm">
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
];
