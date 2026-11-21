"use client"

import React from 'react';

export interface SpanLibProps {
    /** Contenu à afficher */
    children?: React.ReactNode;
    /** Callback au clic (optionnel) */
    onClick?: () => void;
    /** Additional classes */
    className?: string;
    /** Additional styles */
    style?: React.CSSProperties;
}

export const SpanLib: React.FC<SpanLibProps> = ({
                                                    children,
                                                    onClick,
                                                    className,
                                                    style,
                                                }) => {
    // Cliquable : rôle bouton, atteignable au clavier (Tab) et activable avec Entrée / Espace.
    const interactive = onClick
        ? {
            role: "button",
            tabIndex: 0,
            onClick,
            onKeyDown: (e: React.KeyboardEvent<HTMLSpanElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            },
        }
        : {};

    return (
        <span
            className={`span-lib ${onClick ? 'span-lib--clickable' : ''} ${className}`}
            style={style}
            {...interactive}
        >
            {children}
        </span>
    );
};