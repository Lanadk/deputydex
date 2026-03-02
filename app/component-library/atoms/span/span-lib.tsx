"use client"

import React from 'react';

export interface SpanLibProps {
    /** Identificateur */
    key?: string;
    /** Contenu à afficher */
    children?: React.ReactNode;
    /** Callback au clic (optionnel) */
    onClick?: () => void;
}

export const SpanLib: React.FC<SpanLibProps> = ({
                                                    key,
                                                    children,
                                                    onClick
                                                }) => {
    return (
        <span
            key={key}
            className={`span-lib ${onClick ? 'span-lib--clickable' : ''}`}
            onClick={onClick}
        >
            {children}
        </span>
    );
};