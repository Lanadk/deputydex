import { useEffect, useState } from "react";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";
import { LegislatureDTO } from "@/app/domains/legislatures/dto/legislature.dto";

/**
 * Liste des législatures, indépendante du LegislatureProvider app-wide
 * (celui-ci porte LA législature courante de navigation, un concept qui n'a
 * pas de sens ici : chaque contexte de comparaison choisit sa propre
 * législature, indépendamment de ce qui est affiché ailleurs dans l'app).
 */
export function useLegislaturesList(): LegislatureDTO[] {
    const [legislatures, setLegislatures] = useState<LegislatureDTO[]>([]);

    useEffect(() => {
        let cancelled = false;

        legislaturesGateway
            .getAll()
            .then((list) => {
                if (!cancelled) setLegislatures(list);
            })
            .catch(() => {
                if (!cancelled) setLegislatures([]);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return legislatures;
}
