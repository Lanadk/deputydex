"use client";

import React, { useRef, useState } from "react";
import { BadgeLib } from "@/app/(ui)/component-library/atoms/badge/badge-lib";

export type ExpandableCardStat = {
    label: string;
    value: number | string;
};

/** Couleur d'un statut : "success" pour une issue favorable (ex. amendement adopté). */
export type ExpandableCardItemTone = "success" | "neutral";

export type ExpandableCardItem = {
    id: string;
    label: string;
    /** Intitulé du groupe : les éléments consécutifs de même groupe sont réunis sous un titre */
    group?: string;
    context?: string | null;
    status?: string | null;
    tone?: ExpandableCardItemTone;
    date?: string | null;
    summary?: string | null;
    href?: string;
};

export type ExpandableCardLibProps = {
    /** Titre de la carte */
    title: string;
    /** Lien externe du titre (ouvert dans un nouvel onglet) */
    href?: string;
    /** Ligne secondaire (ex. type de procédure) */
    subtitle?: string | null;
    /** Rôles mis en avant (ex. "Rapporteur", "Auteur du texte") */
    badges?: string[];
    /** Compteurs affichés sous le titre */
    stats?: ExpandableCardStat[];
    /** Libellé du bouton de dépliage et de la liste */
    itemsLabel: string;
    /** Message quand le détail chargé est vide */
    emptyLabel?: string;
    /** Charge le détail au premier dépliage */
    loadItems: () => Promise<ExpandableCardItem[]>;
};

export const ExpandableCardLib: React.FC<ExpandableCardLibProps> = ({
    title,
    href,
    subtitle,
    badges = [],
    stats = [],
    itemsLabel,
    emptyLabel = "Aucun élément à afficher.",
    loadItems,
}) => {
    const [expanded, setExpanded] = useState(false);
    const [items, setItems] = useState<ExpandableCardItem[] | null>(null);
    const [failed, setFailed] = useState(false);
    // Une seule requête en vol / réussie : les clics répétés ne relancent rien.
    const requested = useRef(false);

    const load = () => {
        requested.current = true;
        setFailed(false);
        loadItems()
            .then(setItems)
            .catch(() => {
                requested.current = false;
                setFailed(true);
            });
    };

    const toggle = () => {
        const next = !expanded;
        setExpanded(next);
        if (next && !requested.current) load();
    };

    return (
        <article className="expandable-card-lib" aria-label={title}>
            <header className="expandable-card-lib__header">
                {href ? (
                    <a className="expandable-card-lib__title" href={href} target="_blank" rel="noopener noreferrer">
                        {title}
                    </a>
                ) : (
                    <span className="expandable-card-lib__title">{title}</span>
                )}
                {subtitle && <span className="expandable-card-lib__subtitle">{subtitle}</span>}
                {badges.length > 0 && (
                    <div className="expandable-card-lib__badges">
                        {badges.map((badge) => (
                            <BadgeLib key={badge} text={badge} variant="primary" />
                        ))}
                    </div>
                )}
            </header>

            <div className="expandable-card-lib__footer">
                <dl className="expandable-card-lib__stats">
                    {stats.map((stat) => (
                        <div key={stat.label} className="expandable-card-lib__stat">
                            <dt>{stat.label}</dt>
                            <dd>{stat.value}</dd>
                        </div>
                    ))}
                </dl>
                <button type="button" className="expandable-card-lib__toggle" aria-expanded={expanded} onClick={toggle}>
                    {itemsLabel}
                </button>
            </div>

            {expanded && !items && !failed && <p className="expandable-card-lib__state">Chargement…</p>}

            {expanded && failed && (
                <p className="expandable-card-lib__state">
                    Impossible de charger le détail.{" "}
                    <button type="button" className="expandable-card-lib__retry" onClick={load}>Réessayer</button>
                </p>
            )}

            {expanded && items?.length === 0 && <p className="expandable-card-lib__state">{emptyLabel}</p>}

            {expanded && items && items.length > 0 && groupItems(items).map(({ group, items: groupItemsList }, index) =>
                group ? (
                    <section
                        key={group}
                        role="group"
                        aria-label={`${group} (${groupItemsList.length})`}
                        className="expandable-card-lib__group"
                    >
                        <h4 className="expandable-card-lib__group-title">
                            {group} <span className="expandable-card-lib__group-count">({groupItemsList.length})</span>
                        </h4>
                        <ItemList items={groupItemsList} />
                    </section>
                ) : (
                    <ItemList key={`ungrouped-${index}`} items={groupItemsList} />
                )
            )}
        </article>
    );
};

/** Regroupe les éléments consécutifs partageant le même `group` (l'ordre reçu est conservé). */
function groupItems(items: ExpandableCardItem[]): { group: string | undefined; items: ExpandableCardItem[] }[] {
    const groups: { group: string | undefined; items: ExpandableCardItem[] }[] = [];
    for (const item of items) {
        const last = groups[groups.length - 1];
        if (last && last.group === item.group) last.items.push(item);
        else groups.push({ group: item.group, items: [item] });
    }
    return groups;
}

function ItemList({ items }: { items: ExpandableCardItem[] }) {
    return (
        <ul className="expandable-card-lib__items">
            {items.map((item) => (
                <li key={item.id} className="expandable-card-lib__item">
                    <div className="expandable-card-lib__item-head">
                        {item.href ? (
                            <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
                        ) : (
                            <span>{item.label}</span>
                        )}
                        {item.context && <span className="expandable-card-lib__item-context">{item.context}</span>}
                        {item.status && (
                            <span className={`expandable-card-lib__item-status expandable-card-lib__item-status--${item.tone ?? "neutral"}`}>
                                {item.status}
                            </span>
                        )}
                        {item.date && <span className="expandable-card-lib__item-date">{item.date}</span>}
                    </div>
                    {item.summary && <p className="expandable-card-lib__item-summary">{item.summary}</p>}
                </li>
            ))}
        </ul>
    );
}
