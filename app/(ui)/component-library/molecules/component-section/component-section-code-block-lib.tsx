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
}

export const ComponentSectionCodeBlockLib: React.FC<ComponentSectionCodeBlockProps> = ({
                                                                      title,
                                                                      code,
                                                                      children,
                                                                  }) => {
    return (
        <div>
            <h3>{title}</h3>
            <div className="mt-4">
                <CodeBlockLib code={code}>
                    {children}
                </CodeBlockLib>
            </div>
        </div>
    );
};