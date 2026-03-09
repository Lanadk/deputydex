"use client";

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext<{
    isOpen: boolean;
    toggle: () => void;
}>({ isOpen: false, toggle: () => {} });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <SidebarContext.Provider value={{ isOpen, toggle: () => setIsOpen(p => !p) }}>
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = () => useContext(SidebarContext);