"use client";

import React, { useRef, useState } from "react";
import { BadgeLib } from "@/app/(ui)/component-library/atoms/badge/badge-lib";

export type DossierCardStat = {
    label: string;
    value: number | string;
};

/** Couleur d'un statut : "success" pour une issue favorable (ex. amendement adopté). */
export type DossierCardItemTone = "success" | "neutral";

export type DossierCardItem = {
    id: string;
    label: string;
    /** Intitulé du groupe : les éléments consécutifs de même groupe sont réunis sous un titre */
    group?: string;
    context?: string | null;
    status?: string | null;
    tone?: DossierCardItemTone;
    date?: string | null;
    summary?: string | null;
    href?: string;
};

export type DossierCardLibProps = {
    /** Titre du dossier */
    title: string;
    /** Lien externe vers le dossier (ouvert dans un nouvel onglet) */
    href?: string;
    /** Ligne secondaire (ex. type de procédure) */
    subtitle?: string | null;
    /** Rôles mis en avant (ex. "Rapporteur", "Auteur du texte") */
    badges?: string[];
    /** Compteurs affichés sous le titre */
    stats?: DossierCardStat[];
    /** Libellé du bouton de dépliage et de la liste */
    itemsLabel: string;
    /** Message quand le détail chargé est vide */
    emptyLabel?: string;
    /** Charge le détail au premier dépliage */
    loadItems: () => Promise<DossierCardItem[]>;
};

export const DossierCardLib: React.FC<DossierCardLibProps> = ({
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
    const [items, setItems] = useState<DossierCardItem[] | null>(null);
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
        <article className="dossier-card-lib" aria-label={title}>
            <header className="dossier-card-lib__header">
                {href ? (
                    <a className="dossier-card-lib__title" href={href} target="_blank" rel="noopener noreferrer">
                        {title}
                    </a>
                ) : (
                    <span className="dossier-card-lib__title">{title}</span>
                )}
                {subtitle && <span className="dossier-card-lib__subtitle">{subtitle}</span>}
                {badges.length > 0 && (
                    <div className="dossier-card-lib__badges">
                        {badges.map((badge) => (
                            <BadgeLib key={badge} text={badge} variant="primary" />
                        ))}
                    </div>
                )}
            </header>

            <div className="dossier-card-lib__footer">
                <dl className="dossier-card-lib__stats">
                    {stats.map((stat) => (
                        <div key={stat.label} className="dossier-card-lib__stat">
                            <dt>{stat.label}</dt>
                            <dd>{stat.value}</dd>
                        </div>
                    ))}
                </dl>
                <button type="button" className="dossier-card-lib__toggle" aria-expanded={expanded} onClick={toggle}>
                    {itemsLabel}
                </button>
            </div>

            {expanded && !items && !failed && <p className="dossier-card-lib__state">Chargement…</p>}

            {expanded && failed && (
                <p className="dossier-card-lib__state">
                    Impossible de charger le détail.{" "}
                    <button type="button" className="dossier-card-lib__retry" onClick={load}>Réessayer</button>
                </p>
            )}

            {expanded && items?.length === 0 && <p className="dossier-card-lib__state">{emptyLabel}</p>}

            {expanded && items && items.length > 0 && groupItems(items).map(({ group, items: groupItemsList }, index) =>
                group ? (
                    <section
                        key={group}
                        role="group"
                        aria-label={`${group} (${groupItemsList.length})`}
                        className="dossier-card-lib__group"
                    >
                        <h4 className="dossier-card-lib__group-title">
                            {group} <span className="dossier-card-lib__group-count">({groupItemsList.length})</span>
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
function groupItems(items: DossierCardItem[]): { group: string | undefined; items: DossierCardItem[] }[] {
    const groups: { group: string | undefined; items: DossierCardItem[] }[] = [];
    for (const item of items) {
        const last = groups[groups.length - 1];
        if (last && last.group === item.group) last.items.push(item);
        else groups.push({ group: item.group, items: [item] });
    }
    return groups;
}

function ItemList({ items }: { items: DossierCardItem[] }) {
    return (
        <ul className="dossier-card-lib__items">
            {items.map((item) => (
                <li key={item.id} className="dossier-card-lib__item">
                    <div className="dossier-card-lib__item-head">
                        {item.href ? (
                            <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
                        ) : (
                            <span>{item.label}</span>
                        )}
                        {item.context && <span className="dossier-card-lib__item-context">{item.context}</span>}
                        {item.status && (
                            <span className={`dossier-card-lib__item-status dossier-card-lib__item-status--${item.tone ?? "neutral"}`}>
                                {item.status}
                            </span>
                        )}
                        {item.date && <span className="dossier-card-lib__item-date">{item.date}</span>}
                    </div>
                    {item.summary && <p className="dossier-card-lib__item-summary">{item.summary}</p>}
                </li>
            ))}
        </ul>
    );
}
