"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";

type TabSectionContextType = {
    /** Section affichée. */
    activeId: string;
    /** Ouvre une section ; l'URL garde l'onglet (`#id`) pour un lien direct ou un rechargement. */
    select: (id: string) => void;
};

const TabSectionContext = createContext<TabSectionContextType>({
    activeId: "",
    select: () => {},
});

const abonnerHash = (onChange: () => void) => {
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
};
const lireHash = () => window.location.hash.slice(1);
// Côté serveur, pas d'URL : premier onglet, puis celui de l'URL à l'hydratation.
const hashServeur = () => "";

/**
 * État des onglets d'un TabLayout : la section ouverte. Sans choix de
 * l'utilisateur, c'est celle du `#id` de l'URL (lien direct, rechargement,
 * bouton Précédent), sinon la première.
 */
export function TabSectionProvider({ ids, children }: { ids: string[]; children: React.ReactNode }) {
    const hash = useSyncExternalStore(abonnerHash, lireHash, hashServeur);
    const [choisi, setChoisi] = useState<string | null>(null);

    // Un changement d'URL qui ne vient pas d'un onglet (Précédent, lien #…) reprend la main.
    useEffect(() => {
        const suivreUrl = () => setChoisi(null);
        window.addEventListener("hashchange", suivreUrl);
        return () => window.removeEventListener("hashchange", suivreUrl);
    }, []);

    const select = useCallback((id: string) => {
        setChoisi(id);
        if (window.location.hash !== `#${id}`) window.history.replaceState(null, "", `#${id}`);
    }, []);

    const activeId = choisi ?? (ids.includes(hash) ? hash : ids[0] ?? "");
    const value = useMemo(() => ({ activeId, select }), [activeId, select]);

    return <TabSectionContext.Provider value={value}>{children}</TabSectionContext.Provider>;
}

export const useTabSection = () => useContext(TabSectionContext);
