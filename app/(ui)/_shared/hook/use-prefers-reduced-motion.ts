import { useEffect, useState } from "react";

/**
 * L'utilisateur a demandé à réduire les animations (`prefers-reduced-motion`),
 * suivi en direct. `false` au premier rendu (et côté serveur), puis la vraie valeur.
 */
export function usePrefersReducedMotion(): boolean {
    const [reduit, setReduit] = useState(false);
    useEffect(() => {
        const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        if (!media) return;
        const maj = () => setReduit(media.matches);
        maj();
        media.addEventListener("change", maj);
        return () => media.removeEventListener("change", maj);
    }, []);
    return reduit;
}
