"use client"

import React from 'react';
import { CodeBlockLib } from "@/app/(ui)/component-library/molecules/code-block/code-block-lib";

export interface ComponentSectionCodeBlockProps {
    /** Titre de la section */
    title: string;
    /** Code à afficher */
    code: string;
    /** Preview du composant */
    children: React.ReactNode;
    /** Description */
    description?: string;
}

export const ComponentSectionCodeBlockLib: React.FC<ComponentSectionCodeBlockProps> = ({
                                                                      title,
                                                                      code,
                                                                      children,
                                                                      description = ""
                                                                  }) => {
    return (
        <div>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="mt-4">
                <CodeBlockLib code={code}>
                    {children}
                </CodeBlockLib>
            </div>
        </div>
    );
};