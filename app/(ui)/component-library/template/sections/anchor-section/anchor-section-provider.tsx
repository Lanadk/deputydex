"use client";

import React, { createContext, useContext, useState } from "react";

type AnchorSectionContextType = {
    activeId: string;
    setActiveId: (id: string) => void;
};

const AnchorSectionContext = createContext<AnchorSectionContextType>({
    activeId: "",
    setActiveId: () => {},
});

export function AnchorSectionProvider({
                                          initialId,
                                          children,
                                      }: {
    initialId?: string;
    children: React.ReactNode;
}) {
    const [activeId, setActiveId] = useState<string>(initialId ?? "");

    return (
        <AnchorSectionContext.Provider value={{ activeId, setActiveId }}>
            {children}
        </AnchorSectionContext.Provider>
    );
}

export const useAnchorSection = () => useContext(AnchorSectionContext);