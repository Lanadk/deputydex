"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { LegislatureDTO } from "@/app/domains/legislatures/dto/legislature.dto";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";

type LegislatureContextType = {
    legislature: LegislatureDTO | null;
    legislatures: LegislatureDTO[];
    setLegislature: (l: LegislatureDTO) => void;
    loading: boolean;
};

const LegislatureContext = createContext<LegislatureContextType>({
    legislature: null,
    legislatures: [],
    setLegislature: () => {},
    loading: true,
});

export function LegislatureProvider({ children }: { children: React.ReactNode }) {
    const [legislature, setLegislature] = useState<LegislatureDTO | null>(null);
    const [legislatures, setLegislatures] = useState<LegislatureDTO[]>([]);
    const [loading, setLoading] = useState(true);

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
        <LegislatureContext.Provider value={{ legislature, legislatures, setLegislature, loading }}>
            {children}
        </LegislatureContext.Provider>
    );
}

export const useLegislature = () => useContext(LegislatureContext);