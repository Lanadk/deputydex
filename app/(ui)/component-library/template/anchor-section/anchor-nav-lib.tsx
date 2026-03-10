"use client";

import React, { useEffect } from "react";
import {useAnchorSection} from "@/app/(ui)/component-library/template/anchor-section/anchor-section-provider";
import {AnchorSection} from "@/app/(ui)/component-library/template/anchor-section/anchor.types";

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
        const observers: IntersectionObserver[] = [];

        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (!el) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveId(id);
                },
                { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
            );

            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
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
                                    text-sm font-medium transition-all duration-150
                                    sidebar-link
                                    ${isActive ? "sidebar-link--active" : ""}
                                `}
                            >
                                <span
                                    className="w-0.5 h-4 rounded-full shrink-0 transition-all duration-200"
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