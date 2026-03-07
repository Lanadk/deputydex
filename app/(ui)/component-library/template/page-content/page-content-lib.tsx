"use client"

import React from 'react';

export interface PageContentProps {
    /** Sections de composants à afficher */
    children: React.ReactNode;
}

export const PageContentLib: React.FC<PageContentProps> = ({ children }) => {
    return (
        <div className="space-y-8">
            {children}
        </div>
    );
};