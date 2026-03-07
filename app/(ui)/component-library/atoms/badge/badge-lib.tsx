import React from "react";

export interface BadgeLibProps {
    /** Identificateur */
    key?: string;
    /** Texte du badge */
    text: string;
    /** Variante visuelle du bouton */
    variant?: 'primary' | 'secondary' | 'tertiary' ;
}


export const BadgeLib: React.FC<BadgeLibProps> = ({
                                                      key,
                                                      text,
                                                      variant = 'primary',
                                                  }) => {
    return (
        <span
            key={key}
            className={`badge-lib badge-lib--${variant}`}
        >
            {text}
        </span>
    );
}