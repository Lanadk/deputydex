import React from "react";

export type PageStateLibProps = {
    /** Code affiché en grand au-dessus du titre (ex. "404"). Optionnel. */
    code?: string;
    /** Titre de l'état (ex. « Page introuvable »). */
    title: string;
    /** Explication courte, en une ou deux phrases. */
    description?: React.ReactNode;
    /** Actions proposées : liens `<a>` ou boutons (ButtonLib…). */
    children?: React.ReactNode;
};

/**
 * État de page plein écran (introuvable, erreur…) : code, titre, texte et
 * actions, centrés. Sans dépendance au routage Next : les liens passés en
 * `children` sont de simples `<a href>`.
 */
export function PageStateLib({ code, title, description, children }: PageStateLibProps) {
    return (
        <section className="page-state-lib" aria-labelledby="page-state-title">
            {code && <p className="page-state-lib__code" aria-hidden="true">{code}</p>}
            <h1 id="page-state-title" className="page-state-lib__title">{title}</h1>
            {description && <p className="page-state-lib__description">{description}</p>}
            {children && <div className="page-state-lib__actions">{children}</div>}
        </section>
    );
}
