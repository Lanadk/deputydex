import React from 'react';
import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons';

export interface PageHeaderProps {
    /** Titre de la page */
    title: string;
    /** Sous-titre/description */
    subtitle: string;
    /** (optionnel) Icône affichée à gauche du titre (même style que AnchorSectionBlockLib) */
    icon?: LucideIcon | IconType;
    /** (optionnel) Classe CSS supplémentaire pour personnaliser le style du header */
    className?: string;
}

export const PageHeaderLib: React.FC<PageHeaderProps> = ({
                                                          title,
                                                          subtitle,
                                                          icon: Icon,
                                                          className
                                                      }) => {
    return (
        <div className={`mb-8 ${className}`}>
            <div className="flex items-start gap-3">
                {Icon && (
                    <div
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: "var(--surface-3)" }}
                    >
                        <Icon className="h-4 w-4" style={{ color: "var(--accent)" }} />
                    </div>
                )}
                <div className="min-w-0">
                    <h2>{title}</h2>
                    <p className="subtitle mt-2">{subtitle}</p>
                </div>
            </div>
        </div>
    );
};