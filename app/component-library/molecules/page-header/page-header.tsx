import React from 'react';

export interface PageHeaderProps {
    /** Titre de la page */
    title: string;
    /** Sous-titre/description */
    subtitle: string;
    /** Classes CSS supplémentaires */
    className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
                                                          title,
                                                          subtitle,
                                                          className = '',
                                                      }) => {
    return (
        <div className={`mb-8 ${className}`}>
            <h2>{title}</h2>
            <p className="subtitle mt-2">{subtitle}</p>
        </div>
    );
};