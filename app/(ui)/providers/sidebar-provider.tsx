"use client";

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext<{
    isOpen: boolean;
    toggle: () => void;
    setOpen: (open: boolean) => void;
}>({ isOpen: false, toggle: () => {}, setOpen: () => {} });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <SidebarContext.Provider value={{ isOpen, toggle: () => setIsOpen(p => !p), setOpen: setIsOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = () => useContext(SidebarContext);