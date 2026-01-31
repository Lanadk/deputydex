"use client"

import React from 'react';
import { CodeBlock } from "@/app/component-library/molecules/code-block/code-block";

export interface ComponentSectionCodeBlockProps {
    /** Titre de la section */
    title: string;
    /** Code à afficher */
    code: string;
    /** Preview du composant */
    children: React.ReactNode;
}

export const ComponentSectionCodeBlock: React.FC<ComponentSectionCodeBlockProps> = ({
                                                                      title,
                                                                      code,
                                                                      children,
                                                                  }) => {
    return (
        <div>
            <h3>{title}</h3>
            <div className="mt-4">
                <CodeBlock code={code}>
                    {children}
                </CodeBlock>
            </div>
        </div>
    );
};