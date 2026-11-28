import React from "react";

type ComingSoonLibProps = {
    /** Mention affichée par-dessus le contenu flouté (défaut : « Disponible bientôt »). */
    label?: string;
    /** Aperçu du futur contenu : flouté, ni lisible ni cliquable. */
    children: React.ReactNode;
    className?: string;
};

/**
 * Contenu à venir : son aperçu est flouté sous une mention « Disponible
 * bientôt ». L'aperçu est sorti de l'arbre d'accessibilité et de la navigation
 * clavier (`inert`) : seule la mention est lue.
 */
export const ComingSoonLib: React.FC<ComingSoonLibProps> = ({ label = "Disponible bientôt", children, className = "" }) => (
    <div className={`coming-soon ${className}`}>
        <div className="coming-soon__apercu" aria-hidden="true" inert>
            {children}
        </div>
        <div className="coming-soon__voile">
            <span className="coming-soon__mention" role="status">{label}</span>
        </div>
    </div>
);
