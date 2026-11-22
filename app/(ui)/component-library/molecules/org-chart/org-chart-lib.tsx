"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AvatarLib } from "@/app/(ui)/component-library/atoms/badge-avatar/avatar-picture-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";

export type OrgChartBadge = {
    label: string;
    /** Couleurs de la pastille (ex. thème d'un groupe politique). */
    background: string;
    color: string;
    /** Intitulé complet, en info-bulle et pour les lecteurs d'écran. */
    title?: string;
};

export type OrgChartNode = {
    id: string;
    title: string;
    subtitle?: string | null;
    /** Lien vers une fiche (ex. celle du député). */
    href?: string | null;
    /** Mention secondaire (ex. « jusqu'au 01/03/2026 »). */
    note?: string | null;
    /** Avatar : photo si `src`, sinon initiales de `title`. Absent : pas d'avatar. */
    avatar?: { src: string | null } | null;
    badge?: OrgChartBadge | null;
    /**
     * `group` : simple intitulé de regroupement (ex. « Ministres délégués »),
     * affiché comme un titre de section et non comme une carte. `subtitle` y
     * devient un compteur discret.
     */
    variant?: "card" | "group";
    children?: OrgChartNode[];
};

export type OrgChartLibProps = {
    root: OrgChartNode;
    ariaLabel?: string;
    /** Affiche « Tout déplier / Tout replier » au-dessus de l'arbre. */
    showExpandControls?: boolean;
};

/** Au-delà de ce nombre, des enfants sans descendance s'affichent en grille compacte. */
const GRID_THRESHOLD = 3;

function NodeCard({ node, isRoot }: { node: OrgChartNode; isRoot?: boolean }) {
    const title = node.href
        ? <a href={node.href} className="org-chart-lib__title">{node.title}</a>
        : <span className="org-chart-lib__title">{node.title}</span>;
    return (
        <div className={`org-chart-lib__card${isRoot ? " org-chart-lib__card--root" : ""}`}>
            {node.avatar && <AvatarLib src={node.avatar.src ?? undefined} name={node.title} size="small" alt="" />}
            <div className="org-chart-lib__text">
                {title}
                {node.subtitle && <span className="org-chart-lib__subtitle" title={node.subtitle}>{node.subtitle}</span>}
                {node.note && <span className="org-chart-lib__note">{node.note}</span>}
            </div>
            {/* Toujours dans le coin haut-droit de la carte, quelle que soit la longueur du nom. */}
            {node.badge && (
                <span
                    className="org-chart-lib__badge"
                    style={{ backgroundColor: node.badge.background, color: node.badge.color }}
                    title={node.badge.title}
                    aria-label={node.badge.title}
                >
                    {node.badge.label}
                </span>
            )}
        </div>
    );
}

/** Intitulé de regroupement : un titre de section, pas une carte. */
function GroupLabel({ node }: { node: OrgChartNode }) {
    return (
        <div className="org-chart-lib__group">
            <span className="org-chart-lib__group-title">{node.title}</span>
            {node.subtitle && <span className="org-chart-lib__group-count">{node.subtitle}</span>}
        </div>
    );
}

/** Un nœud et, s'il en a, ses enfants repliables (ouverts par défaut). */
function Branch({ node, isRoot, defaultOpen }: { node: OrgChartNode; isRoot?: boolean; defaultOpen: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    const children = node.children ?? [];
    const childrenId = `org-chart-${node.id}-enfants`;

    return (
        <>
            <div className={`org-chart-lib__row${node.variant === "group" ? " org-chart-lib__row--group" : ""}`}>
                {children.length > 0 && (
                    <button
                        type="button"
                        className="org-chart-lib__toggle"
                        aria-expanded={open}
                        aria-controls={childrenId}
                        aria-label={`${open ? "Replier" : "Déplier"} « ${node.title} »`}
                        onClick={() => setOpen((o) => !o)}
                    >
                        {open ? <ChevronDown size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
                    </button>
                )}
                {node.variant === "group" ? <GroupLabel node={node} /> : <NodeCard node={node} isRoot={isRoot} />}
            </div>
            {children.length > 0 && open && <Children id={childrenId} nodes={children} defaultOpen={defaultOpen} />}
        </>
    );
}

function Children({ id, nodes, defaultOpen }: { id: string; nodes: OrgChartNode[]; defaultOpen: boolean }) {
    const allLeaves = nodes.every((n) => !n.children?.length);
    if (allLeaves && nodes.length > GRID_THRESHOLD) {
        return (
            <ul id={id} className="org-chart-lib__children org-chart-lib__children--grid">
                {nodes.map((n) => <li key={n.id} className="org-chart-lib__item"><NodeCard node={n} /></li>)}
            </ul>
        );
    }
    return (
        <ul id={id} className="org-chart-lib__children">
            {nodes.map((n) => (
                <li key={n.id} className="org-chart-lib__item">
                    <Branch node={n} defaultOpen={defaultOpen} />
                </li>
            ))}
        </ul>
    );
}

/**
 * Organigramme : un arbre hiérarchique en listes imbriquées (lisible par les
 * lecteurs d'écran), reliées par des connecteurs. Chaque branche se replie et
 * se déplie (ouverte par défaut). Une longue liste de feuilles (ex. douze
 * secrétaires) s'affiche en grille compacte plutôt qu'en colonne.
 */
export function OrgChartLib({ root, ariaLabel, showExpandControls = false }: OrgChartLibProps) {
    // Changer la clé remonte l'arbre : toutes les branches reprennent l'état demandé.
    const [state, setState] = useState({ open: true, version: 0 });

    return (
        <div className="org-chart-lib" role="group" aria-label={ariaLabel ?? root.title}>
            {showExpandControls && (
                <div className="org-chart-lib__controls">
                    <ButtonLib text="Tout déplier" size="small" variant="tertiary" onClick={() => setState((s) => ({ open: true, version: s.version + 1 }))} />
                    <ButtonLib text="Tout replier" size="small" variant="tertiary" onClick={() => setState((s) => ({ open: false, version: s.version + 1 }))} />
                </div>
            )}
            <Branch key={state.version} node={root} isRoot defaultOpen={state.open} />
        </div>
    );
}
