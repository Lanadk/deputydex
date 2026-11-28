"use client";

import React, { useEffect } from "react";
import {useAnchorSection} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-section-provider";
import {AnchorSection} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";

interface AnchorNavLibProps {
    sections: AnchorSection[];
    /** Label affiché au-dessus de la liste (défaut : "Sections") */
    label?: string;
}

/**
 * AnchorNavLib
 * Nav latérale sticky générique avec IntersectionObserver.
 * Utilisable sur n'importe quelle page via AnchorLayoutLib.
 */
export const AnchorNavLib: React.FC<AnchorNavLibProps> = ({
                                                              sections,
                                                              label = "Sections",
                                                          }) => {
    const { activeId, setActiveId } = useAnchorSection();

    useEffect(() => {
        const observed = new Map<string, Element>();
        const intersection = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                }
            },
            { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
        );

        // Les sections peuvent arriver APRÈS le montage de la nav (ex: les
        // Chiffres clés n'affichent leurs sections qu'une fois la législature
        // chargée, un spinner avant) ou être remplacées par un re-rendu : on
        // (ré)attache l'observateur à chaque changement du DOM plutôt qu'une
        // seule fois, sinon la nav ne suit jamais le défilement.
        const attach = () => {
            for (const { id } of sections) {
                const el = document.getElementById(id);
                if (!el || observed.get(id) === el) continue;
                const previous = observed.get(id);
                if (previous) intersection.unobserve(previous);
                intersection.observe(el);
                observed.set(id, el);
            }
        };

        attach();
        const mutations = new MutationObserver(attach);
        mutations.observe(document.body, { childList: true, subtree: true });

        return () => {
            mutations.disconnect();
            intersection.disconnect();
        };
    }, [sections, setActiveId]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id);
    };

    return (
        <nav aria-label={`Navigation — ${label}`}>
            <p
                className="text-xs font-bold uppercase tracking-widest mb-3 px-2"
                style={{ color: "var(--subtitle-accent)" }}
            >
                {label}
            </p>

            <ul className="flex flex-col gap-0.5">
                {sections.map(({ id, label: sectionLabel, icon: Icon }) => {
                    const isActive = activeId === id;
                    return (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                onClick={(e) => handleClick(e, id)}
                                className={`
                                    flex items-center gap-2.5 px-2.5 py-2 rounded-lg
                                    text-sm font-medium transition-transform duration-150
                                    sidebar-link
                                    ${isActive ? "sidebar-link--active" : ""}
                                `}
                            >
                                <span
                                    className="w-0.5 h-4 rounded-full shrink-0 transition-transform duration-200"
                                    style={{
                                        backgroundColor: isActive ? "var(--accent)" : "transparent",
                                        opacity: isActive ? 1 : 0,
                                    }}
                                />
                                <Icon className="w-4 h-4 shrink-0" />
                                <span className="leading-tight">{sectionLabel}</span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};