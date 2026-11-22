"use client";

import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { useNotifications } from "@/app/(ui)/component-library/molecules/notification/notification-lib";
import { LegislatureDTO } from "@/app/domains/legislatures/dto/legislature.dto";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";

type LegislatureContextType = {
    legislature: LegislatureDTO | null;
    legislatures: LegislatureDTO[];
    setLegislature: (l: LegislatureDTO) => void;
    loading: boolean;
    /** Le chargement des législatures a échoué (une notification le signale, avec « Réessayer »). */
    error: boolean;
    retry: () => void;
    /**
     * Numéros de législature à griser dans le sélecteur. Deux cas d'usage :
     * - un code de groupe n'existe que sous une autre appellation dans ces
     *   législatures (RE n'existe qu'en 16e, EPR qu'en 17e — pas de mapping
     *   automatique possible, voir groupe-page-client.tsx) ;
     * - un député n'a pas siégé sous ces législatures (voir
     *   depute-page-client.tsx), appeler son identité dessus ferait échouer
     *   la requête serveur.
     * Une page l'alimente via `setUnavailableLegislatureNumbers` et la remet
     * à vide en se démontant.
     */
    unavailableLegislatureNumbers: Set<number>;
    setUnavailableLegislatureNumbers: (numbers: Set<number>) => void;
};

const LegislatureContext = createContext<LegislatureContextType>({
    legislature: null,
    legislatures: [],
    setLegislature: () => {},
    loading: true,
    error: false,
    retry: () => {},
    unavailableLegislatureNumbers: new Set(),
    setUnavailableLegislatureNumbers: () => {},
});

export function LegislatureProvider({ children }: { children: React.ReactNode }) {
    const [legislature, setLegislature] = useState<LegislatureDTO | null>(null);
    const [legislatures, setLegislatures] = useState<LegislatureDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [unavailableLegislatureNumbers, setUnavailableLegislatureNumbers] = useState<Set<number>>(new Set());
    const [error, setError] = useState(false);
    const [retryToken, setRetryToken] = useState(0);
    const retry = useCallback(() => setRetryToken((n) => n + 1), []);
    const { notify } = useNotifications();

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            legislaturesGateway.getCurrent(),
            legislaturesGateway.getAll(),
        ]).then(([current, all]) => {
            if (cancelled) return;
            setLegislature(current);
            setLegislatures(all);
            setError(false);
        }).catch(() => {
            if (cancelled) return;
            // Sans législature, les pages de données ne peuvent rien charger : on le dit, avec un nouvel essai.
            setError(true);
            notify({
                message: "Impossible de charger les législatures pour le moment.",
                variant: "error",
                action: { label: "Réessayer", onClick: retry },
            });
        }).finally(() => {
            if (!cancelled) setLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, [retryToken, notify, retry]);

    return (
        <LegislatureContext.Provider value={{
            legislature,
            legislatures,
            setLegislature,
            loading,
            error,
            retry,
            unavailableLegislatureNumbers,
            setUnavailableLegislatureNumbers,
        }}>
            {children}
        </LegislatureContext.Provider>
    );
}

export const useLegislature = () => useContext(LegislatureContext);