"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AvatarLib } from "@/app/(ui)/component-library/atoms/badge-avatar/avatar-picture-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { InfoTipLib } from "@/app/(ui)/component-library/molecules/info-tip/info-tip-lib";

export type OrgChartBadge = {
    label: string;
    /** Couleurs de la pastille (ex. thème d'un groupe politique). */
    background: string;
    color: string;
    /** Intitulé complet, en info-bulle et pour les lecteurs d'écran. */
    title?: string;
};

export type OrgChartInfo = {
    /** Ce que la bulle explique (ex. « Questure »), pour le nom accessible du bouton. */
    subject: string;
    content: React.ReactNode;
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
     * Bulle d'information (ex. définition de la fonction) : icône « i » après
     * l'intitulé d'un regroupement, ou après le sous-titre d'une carte.
     */
    info?: OrgChartInfo | null;
    /**
     * `group` : simple intitulé de regroupement (ex. « Ministres délégués »),
     * affiché comme un titre de section et non comme une carte. `subtitle` y
     * devient un compteur discret.
     */
    variant?: "card" | "group";
    children?: OrgChartNode[];
};

/**
 * `arbre` : listes indentées, de haut en bas et de gauche à droite (par défaut).
 * `pyramide` : chaque niveau centré sous le précédent, les feuilles d'un même
 * parent en rangée ; plus visuel, plus large.
 */
export type OrgChartLayout = "arbre" | "pyramide";

export type OrgChartLibProps = {
    root: OrgChartNode;
    ariaLabel?: string;
    /** Affiche « Tout déplier / Tout replier » au-dessus de l'arbre. */
    showExpandControls?: boolean;
    /** Affichage ; sans `onLayoutChange`, valeur initiale d'un état interne. */
    layout?: OrgChartLayout;
    /** Rend l'affichage contrôlé (ex. conservé d'un onglet à l'autre par la page). */
    onLayoutChange?: (layout: OrgChartLayout) => void;
    /** Affiche le sélecteur « Arbre / Pyramide » à côté des boutons. */
    showLayoutToggle?: boolean;
    /**
     * Ligne placée au-dessus des boutons (ex. des onglets), d'une hauteur
     * minimale fixe. `null` ou `false` : ligne réservée mais vide, pour que les
     * boutons restent à la même hauteur qu'une vue voisine qui en a une.
     * Absent (`undefined`) : pas de ligne.
     */
    toolbar?: React.ReactNode;
    /** Attributs du conteneur de l'arbre seul (ex. `tabPanelProps` quand `toolbar` contient les onglets). */
    treeProps?: React.HTMLAttributes<HTMLDivElement>;
};

/** Au-delà de ce nombre, des enfants sans descendance s'affichent en grille compacte. */
const GRID_THRESHOLD = 3;

function NodeCard({ node, isRoot }: { node: OrgChartNode; isRoot?: boolean }) {
    const title = node.href
        ? <a href={node.href} className="org-chart-lib__title" title={node.title}>{node.title}</a>
        : <span className="org-chart-lib__title" title={node.title}>{node.title}</span>;
    return (
        <div className={`org-chart-lib__card${isRoot ? " org-chart-lib__card--root" : ""}`}>
            {node.avatar && <AvatarLib src={node.avatar.src ?? undefined} name={node.title} size="small" alt="" />}
            <div className="org-chart-lib__text">
                {title}
                {node.subtitle && (
                    <span className="org-chart-lib__subtitle-row">
                        <span className="org-chart-lib__subtitle" title={node.subtitle}>{node.subtitle}</span>
                        {node.info && <NodeInfo info={node.info} />}
                    </span>
                )}
                {!node.subtitle && node.info && <NodeInfo info={node.info} />}
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
            {node.info && <NodeInfo info={node.info} />}
        </div>
    );
}

function NodeInfo({ info }: { info: OrgChartInfo }) {
    return <InfoTipLib subject={info.subject}>{info.content}</InfoTipLib>;
}

/** Un nœud et, s'il en a, ses enfants repliables (ouverts par défaut). */
function Branch({ node, isRoot, defaultOpen }: { node: OrgChartNode; isRoot?: boolean; defaultOpen: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    const children = node.children ?? [];
    const childrenId = `org-chart-${node.id}-enfants`;

    return (
        <>
            <div className={`org-chart-lib__row${node.variant === "group" ? " org-chart-lib__row--group" : ""}`}>
                {children.length > 0 && <ToggleButton open={open} childrenId={childrenId} title={node.title} onClick={() => setOpen((o) => !o)} />}
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

/** Bouton de repli d'une branche (les deux affichages). */
function ToggleButton({ open, childrenId, title, onClick }: { open: boolean; childrenId: string; title: string; onClick: () => void }) {
    return (
        <button
            type="button"
            className="org-chart-lib__toggle"
            aria-expanded={open}
            aria-controls={childrenId}
            aria-label={`${open ? "Replier" : "Déplier"} « ${title} »`}
            onClick={onClick}
        >
            {open ? <ChevronDown size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
        </button>
    );
}

/** Pyramide : le nœud centré, puis ses enfants en dessous, reliés par un trait vertical. */
function PyramidBranch({ node, isRoot, defaultOpen }: { node: OrgChartNode; isRoot?: boolean; defaultOpen: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    const children = node.children ?? [];
    const childrenId = `org-chart-${node.id}-enfants`;

    return (
        <div className="org-chart-lib__pyr-node">
            <div className="org-chart-lib__pyr-head">
                {node.variant === "group" ? <GroupLabel node={node} /> : <NodeCard node={node} isRoot={isRoot} />}
                {children.length > 0 && <ToggleButton open={open} childrenId={childrenId} title={node.title} onClick={() => setOpen((o) => !o)} />}
            </div>
            {children.length > 0 && open && (
                <>
                    <span className="org-chart-lib__pyr-stem" aria-hidden="true" />
                    <PyramidChildren id={childrenId} nodes={children} defaultOpen={defaultOpen} />
                </>
            )}
        </div>
    );
}

/** Feuilles d'un même parent : une rangée centrée. Sinon : les sous-arbres empilés sur l'axe central. */
function PyramidChildren({ id, nodes, defaultOpen }: { id: string; nodes: OrgChartNode[]; defaultOpen: boolean }) {
    const allLeaves = nodes.every((n) => !n.children?.length);
    return (
        <ul id={id} className={`org-chart-lib__pyr-children org-chart-lib__pyr-children--${allLeaves ? "row" : "stack"}`}>
            {nodes.map((n) => (
                <li key={n.id} className="org-chart-lib__pyr-item">
                    {allLeaves
                        ? (n.variant === "group" ? <GroupLabel node={n} /> : <NodeCard node={n} />)
                        : <PyramidBranch node={n} defaultOpen={defaultOpen} />}
                </li>
            ))}
        </ul>
    );
}

const LAYOUTS: { id: OrgChartLayout; label: string }[] = [
    { id: "arbre", label: "Arbre" },
    { id: "pyramide", label: "Pyramide" },
];

/**
 * Organigramme : un arbre hiérarchique en listes imbriquées (lisible par les
 * lecteurs d'écran). Deux affichages : `arbre` (listes indentées reliées par des
 * connecteurs ; une longue liste de feuilles, ex. douze secrétaires, en grille
 * compacte) et `pyramide` (niveaux centrés les uns sous les autres). Chaque
 * branche se replie et se déplie (ouverte par défaut).
 */
export function OrgChartLib({
    root,
    ariaLabel,
    showExpandControls = false,
    layout: layoutProp = "arbre",
    onLayoutChange,
    showLayoutToggle = false,
    toolbar,
    treeProps,
}: OrgChartLibProps) {
    // Changer la clé remonte l'arbre : toutes les branches reprennent l'état demandé.
    const [state, setState] = useState({ open: true, version: 0 });
    const [layoutInterne, setLayoutInterne] = useState<OrgChartLayout>(layoutProp);
    const layout = onLayoutChange ? layoutProp : layoutInterne;
    const changeLayout = onLayoutChange ?? setLayoutInterne;
    const showButtons = showExpandControls || showLayoutToggle;

    return (
        <div className={`org-chart-lib org-chart-lib--${layout}`} role="group" aria-label={ariaLabel ?? root.title}>
            {(showButtons || toolbar !== undefined) && (
                <div className="org-chart-lib__controls">
                    {toolbar !== undefined && <div className="org-chart-lib__toolbar">{toolbar}</div>}
                    {showButtons && (
                        <div className="org-chart-lib__buttons">
                            {showExpandControls && (
                                <>
                                    <ButtonLib text="Tout déplier" size="small" variant="tertiary" onClick={() => setState((s) => ({ open: true, version: s.version + 1 }))} />
                                    <ButtonLib text="Tout replier" size="small" variant="tertiary" onClick={() => setState((s) => ({ open: false, version: s.version + 1 }))} />
                                </>
                            )}
                            {showLayoutToggle && (
                                <div className="org-chart-lib__layout" role="group" aria-label="Affichage de l'organigramme">
                                    {LAYOUTS.map((l) => (
                                        <button
                                            key={l.id}
                                            type="button"
                                            className={`org-chart-lib__layout-btn${layout === l.id ? " org-chart-lib__layout-btn--active" : ""}`}
                                            aria-pressed={layout === l.id}
                                            onClick={() => changeLayout(l.id)}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            <div {...treeProps}>
                {layout === "pyramide"
                    ? <PyramidBranch key={state.version} node={root} isRoot defaultOpen={state.open} />
                    : <Branch key={state.version} node={root} isRoot defaultOpen={state.open} />}
            </div>
        </div>
    );
}
