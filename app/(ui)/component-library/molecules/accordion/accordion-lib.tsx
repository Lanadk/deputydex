"use client";

import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionLibItem {
    id: string;
    title: string;
    /** Texte discret à droite du titre (ex: un résumé, un nombre). */
    hint?: string;
    content: React.ReactNode;
}

interface AccordionLibProps {
    items: AccordionLibItem[];
    /** Plusieurs panneaux ouverts à la fois (défaut) ; `false` = en ouvrir un referme les autres. */
    multiple?: boolean;
    /** Panneaux ouverts au premier rendu (défaut : tous fermés). */
    defaultOpenIds?: string[];
    className?: string;
}

/**
 * AccordionLib
 * Liste de panneaux repliables (motif ARIA « accordion ») : chaque en-tête
 * est un bouton (`aria-expanded`, `aria-controls`), son panneau une région
 * étiquetée par lui, retirée du rendu quand elle est fermée. Clavier : Tab
 * entre les en-têtes, Entrée / Espace pour ouvrir ou fermer, flèches haut /
 * bas, Début / Fin pour passer d'un en-tête à l'autre.
 */
export function AccordionLib({ items, multiple = true, defaultOpenIds = [], className = "" }: AccordionLibProps) {
    const prefix = useId();
    const [open, setOpen] = useState<Set<string>>(() => new Set(defaultOpenIds));

    const toggle = (id: string) =>
        setOpen((current) => {
            const next = new Set(multiple ? current : []);
            if (current.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const focusHeader = (index: number) => {
        const i = (index + items.length) % items.length;
        document.getElementById(`${prefix}-header-${items[i].id}`)?.focus();
    };

    const onKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "ArrowDown") focusHeader(index + 1);
        else if (e.key === "ArrowUp") focusHeader(index - 1);
        else if (e.key === "Home") focusHeader(0);
        else if (e.key === "End") focusHeader(items.length - 1);
        else return;
        e.preventDefault();
    };

    return (
        <div className={`flex flex-col divide-y rounded-lg border border-main ${className}`} style={{ borderColor: "var(--border-main)" }}>
            {items.map((item, i) => {
                const expanded = open.has(item.id);
                const headerId = `${prefix}-header-${item.id}`;
                const panelId = `${prefix}-panel-${item.id}`;
                return (
                    <div key={item.id} className="border-main">
                        <h4 className="m-0">
                            <button
                                type="button"
                                id={headerId}
                                aria-expanded={expanded}
                                aria-controls={panelId}
                                onClick={() => toggle(item.id)}
                                onKeyDown={(e) => onKeyDown(e, i)}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium hover:bg-surface-3 focus-visible:outline-2"
                                style={{ color: "var(--foreground)" }}
                            >
                                <span className="flex-1">{item.title}</span>
                                {item.hint && <span className="text-xs" style={{ color: "var(--subtitle-accent)" }}>{item.hint}</span>}
                                <ChevronDown
                                    aria-hidden="true"
                                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                                    style={{ color: "var(--subtitle-accent)" }}
                                />
                            </button>
                        </h4>
                        <div id={panelId} role="region" aria-labelledby={headerId} hidden={!expanded} className="px-4 pb-4">
                            {expanded && item.content}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
