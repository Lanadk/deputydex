import React from 'react';

export interface PageHeaderLibProps {
    /** Titre de la page */
    title: string;
    /** Sous-titre/description */
    subtitle: string;
    /** Classes CSS supplémentaires */
    className?: string;
}

export const PageHeaderLib: React.FC<PageHeaderLibProps> = ({
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