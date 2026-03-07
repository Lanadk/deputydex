import React from 'react';

export interface PageHeaderProps {
    /** Titre de la page */
    title: string;
    /** Sous-titre/description */
    subtitle: string;

}

export const PageHeader: React.FC<PageHeaderProps> = ({
                                                          title,
                                                          subtitle
                                                      }) => {
    return (
        <div className={`mb-8`}>
            <h2>{title}</h2>
            <p className="subtitle mt-2">{subtitle}</p>
        </div>
    );
};