import React from "react";

export type OrgChartNode = {
    id: string;
    title: string;
    subtitle?: string | null;
    /** Lien vers une fiche (ex. celle du député). */
    href?: string | null;
    /** Mention secondaire (ex. « jusqu'au 01/03/2026 »). */
    note?: string | null;
    children?: OrgChartNode[];
};

export type OrgChartLibProps = {
    root: OrgChartNode;
    ariaLabel?: string;
};

/** Au-delà de ce nombre, des enfants sans descendance s'affichent en grille compacte. */
const GRID_THRESHOLD = 3;

function NodeCard({ node, isRoot }: { node: OrgChartNode; isRoot?: boolean }) {
    const title = node.href ? <a href={node.href} className="org-chart-lib__title">{node.title}</a> : <span className="org-chart-lib__title">{node.title}</span>;
    return (
        <div className={`org-chart-lib__card${isRoot ? " org-chart-lib__card--root" : ""}`}>
            {title}
            {node.subtitle && <span className="org-chart-lib__subtitle">{node.subtitle}</span>}
            {node.note && <span className="org-chart-lib__note">{node.note}</span>}
        </div>
    );
}

function Children({ nodes }: { nodes: OrgChartNode[] }) {
    const allLeaves = nodes.every((n) => !n.children?.length);
    if (allLeaves && nodes.length > GRID_THRESHOLD) {
        return (
            <ul className="org-chart-lib__children org-chart-lib__children--grid">
                {nodes.map((n) => <li key={n.id} className="org-chart-lib__item"><NodeCard node={n} /></li>)}
            </ul>
        );
    }
    return (
        <ul className="org-chart-lib__children">
            {nodes.map((n) => (
                <li key={n.id} className="org-chart-lib__item">
                    <NodeCard node={n} />
                    {n.children && n.children.length > 0 && <Children nodes={n.children} />}
                </li>
            ))}
        </ul>
    );
}

/**
 * Organigramme : un arbre hiérarchique en listes imbriquées (lisible par les
 * lecteurs d'écran), reliées par des connecteurs. Une longue liste de feuilles
 * (ex. douze secrétaires) s'affiche en grille compacte plutôt qu'en colonne.
 */
export function OrgChartLib({ root, ariaLabel }: OrgChartLibProps) {
    return (
        <div className="org-chart-lib" role="group" aria-label={ariaLabel ?? root.title}>
            <NodeCard node={root} isRoot />
            {root.children && root.children.length > 0 && <Children nodes={root.children} />}
        </div>
    );
}
