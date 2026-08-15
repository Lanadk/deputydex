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
    return (
        <span
            className={`span-lib ${onClick ? 'span-lib--clickable' : ''} ${className}`}
            style={style}
            onClick={onClick}
        >
            {children}
        </span>
    );
};