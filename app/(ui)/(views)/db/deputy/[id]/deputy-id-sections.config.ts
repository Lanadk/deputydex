import { User } from "lucide-react";
import { AnchorSection } from "@/app/(ui)/component-library/template/anchor-section/anchor.types";
import { SectionBlock } from "@/app/(ui)/component-library/template/block-section/block-section-renderer";
import { FicheDeputeDTO } from "@/app/domains/acteurs/dto/fiche-depute.dto";
import { acteursGateway } from "@/app/(ui)/gateways/acteurs/acteurs.gateway";

export interface DeputeSection extends AnchorSection {
    description: string;
    cols: 1 | 2 | 3 | 4;
    blocks: SectionBlock[];
    buildBlocks?: (depute: FicheDeputeDTO) => SectionBlock[];
}

export interface DeputeConfig {
    gatewayFn: (id: string) => Promise<FicheDeputeDTO | null>;
    sections: DeputeSection[];
}

export const DEPUTE_CONFIG: DeputeConfig = {
    gatewayFn: (id) => acteursGateway.getFicheDepute(id),
    sections: [
        {
            id: "identite",
            label: "Identité",
            icon: User,
            description: "Profil civil, circonscription et mandat.",
            cols: 2,
            blocks: [],
            buildBlocks: (depute): SectionBlock[] => [
                {
                    type: "paragraph",
                    colSpan: 1,
                    items: [
                        { type: "highlight", content: "Identité civile"                                                                                        },
                        { type: "kpi", label: "Civilité",       value: depute.civilite               ?? "—" },
                        { type: "kpi", label: "Nom",            value: depute.nom                    ?? "—" },
                        { type: "kpi", label: "Prénom",         value: depute.prenom                 ?? "—" },
                        { type: "kpi", label: "Date naissance", value: depute.dateNaissance ? new Date(depute.dateNaissance).toLocaleDateString("fr-FR") : "—" },
                        { type: "kpi", label: "Ville",          value: depute.villeNaissance         ?? "—" },
                        { type: "kpi", label: "Département",    value: depute.departementNaissance   ?? "—" },
                        { type: "kpi", label: "Pays",           value: depute.paysNaissance          ?? "—" },
                    ],
                },
                {
                    type: "paragraph",
                    colSpan: 1,
                    items: [
                        { type: "highlight", content: "Mandat & profession"                                                                                    },
                        { type: "kpi", label: "Circonscription", value: depute.circonscription       ?? "—" },
                        { type: "kpi", label: "Département",     value: depute.departement           ?? "—" },
                        { type: "kpi", label: "Région",          value: depute.region                ?? "—" },
                        { type: "kpi", label: "Profession",      value: depute.professionLibelle     ?? "—" },
                        { type: "kpi", label: "Catégorie",       value: depute.professionCategorie   ?? "—" },
                        { type: "kpi", label: "Mandats",         value: `${depute.mandatsCount} mandat(s)`  },
                        { type: "kpi", label: "1ère élection",   value: depute.premiereElection ? "Oui" : "Non" },
                    ],
                },
            ],
        },
    ],
};