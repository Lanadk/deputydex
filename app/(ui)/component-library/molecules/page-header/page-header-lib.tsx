import React from 'react';

export interface PageHeaderProps {
    /** Titre de la page */
    title: string;
    /** Sous-titre/description */
    subtitle: string;
    /** (optionnel) Classe CSS supplémentaire pour personnaliser le style du header */
    className?: string;
}

export const PageHeaderLib: React.FC<PageHeaderProps> = ({
                                                          title,
                                                          subtitle,
                                                          className
                                                      }) => {
    return (
        <div className={`mb-8 ${className}`}>
            <h2>{title}</h2>
            <p className="subtitle mt-2">{subtitle}</p>
        </div>
    );
};