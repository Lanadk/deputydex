"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { LegislatureDTO } from "@/app/domains/legislatures/dto/legislature.dto";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";

type LegislatureContextType = {
    legislature: LegislatureDTO | null;
    legislatures: LegislatureDTO[];
    setLegislature: (l: LegislatureDTO) => void;
    loading: boolean;
    /**
     * Numéros de législature à griser dans le sélecteur, ex: le code d'un
     * groupe n'existe que sous une autre appellation dans ces législatures
     * (RE n'existe qu'en 16e, EPR qu'en 17e — pas de mapping automatique
     * possible, voir groupe-page-client.tsx). Une page l'alimente via
     * `setUnavailableLegislatureNumbers` et la remet à vide en se démontant.
     * //TODO faire la meme chose pour les députés
     */
    unavailableLegislatureNumbers: Set<number>;
    setUnavailableLegislatureNumbers: (numbers: Set<number>) => void;
};

const LegislatureContext = createContext<LegislatureContextType>({
    legislature: null,
    legislatures: [],
    setLegislature: () => {},
    loading: true,
    unavailableLegislatureNumbers: new Set(),
    setUnavailableLegislatureNumbers: () => {},
});

export function LegislatureProvider({ children }: { children: React.ReactNode }) {
    const [legislature, setLegislature] = useState<LegislatureDTO | null>(null);
    const [legislatures, setLegislatures] = useState<LegislatureDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [unavailableLegislatureNumbers, setUnavailableLegislatureNumbers] = useState<Set<number>>(new Set());

    useEffect(() => {
        Promise.all([
            legislaturesGateway.getCurrent(),
            legislaturesGateway.getAll(),
        ]).then(([current, all]) => {
            setLegislature(current);
            setLegislatures(all);
        }).finally(() => setLoading(false));
    }, []);

    return (
        <LegislatureContext.Provider value={{
            legislature,
            legislatures,
            setLegislature,
            loading,
            unavailableLegislatureNumbers,
            setUnavailableLegislatureNumbers,
        }}>
            {children}
        </LegislatureContext.Provider>
    );
}

export const useLegislature = () => useContext(LegislatureContext);