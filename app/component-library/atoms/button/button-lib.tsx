import React from 'react';
import {IconLibType} from "@/app/component-library/const/types";

interface ButtonLibProps {
    /** Texte du bouton */
    text?: string;
    /** Icône à gauche du texte (optionnel) */
    icon?: IconLibType;
    /** Variante visuelle du bouton */
    variant?: 'primary' | 'secondary' | 'tertiary';
    /** Taille du bouton */
    size?: 'small' | 'medium' | 'large';
    /** Callback au clic */
    onClick?: () => void;
}

export const ButtonLib: React.FC<ButtonLibProps> = ({
                                                        text,
                                                        icon: Icon,
                                                        variant = 'primary',
                                                        size = 'medium',
                                                        onClick
                                                    }) => {
    return (
        <button
            className={`gap-2 btn-lib btn-lib--${variant} btn-lib--${size}`}
            onClick={onClick}
        >
            {Icon && <span><Icon size={size === 'small' ? 16 : size === 'large' ? 24 : 20}/></span>}
            {text && <span>{text}</span>}
        </button>
    );
};