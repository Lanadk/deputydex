"use client";

import {createContext, useState, useEffect, useContext} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
    const [legislature, setLegislatureState] = useState<LegislatureDTO | null>(null);
    const [legislatures, setLegislatures] = useState<LegislatureDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        Promise.all([
            legislaturesGateway.getCurrent(),
            legislaturesGateway.getAll(),
        ]).then(([current, all]) => {
            // Si legislature déjà dans l'URL, on la respecte
            const urlLegislature = searchParams.get('legislature');
            const active = urlLegislature
                ? all.find(l => l.number === Number(urlLegislature)) ?? current
                : current;

            setLegislatureState(active);
            setLegislatures(all);

            if (!urlLegislature) {
                const params = new URLSearchParams(searchParams.toString());
                params.set('legislature', String(active?.number));
                router.replace(`${pathname}?${params.toString()}`);
            }
        }).finally(() => setLoading(false));
    }, []);

    const setLegislature = (l: LegislatureDTO) => {
        setLegislatureState(l);
        // Met à jour l'URL en gardant les params existants
        const params = new URLSearchParams(searchParams.toString());
        params.set('legislature', String(l.number));
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <LegislatureContext.Provider value={{ legislature, legislatures, setLegislature, loading }}>
            {children}
        </LegislatureContext.Provider>
    );
}

export const useLegislature = () => useContext(LegislatureContext);