import { ILegislatureOrganisationRepository } from "@/app/domains/legislatures/repositories/ILegislatureOrganisationRepository";
import {
    FonctionAssembleeRow,
    MembreGouvernementRow,
    PremierMinistreRow,
} from "@/app/domains/legislatures/entities/legislature-organisation.entity";

/** Données de test proches de la réalité (16ᵉ et 17ᵉ législatures). */
export const LEGISLATURES = [
    { number: 16, debut: "2022-06-28", fin: "2024-06-09" },
    { number: 17, debut: "2024-07-18", fin: null },
];

export const PREMIERS_MINISTRES: PremierMinistreRow[] = [
    { acteur_uid: "PA_BORNE", prenom: "Élisabeth", nom: "Borne", debut: "2022-05-17", fin: "2024-01-08" },
    { acteur_uid: "PA_ATTAL", prenom: "Gabriel", nom: "Attal", debut: "2024-01-09", fin: "2024-09-04" },
    { acteur_uid: "PA_BARNIER", prenom: "Michel", nom: "Barnier", debut: "2024-09-05", fin: "2024-12-12" },
    { acteur_uid: "PA_LECORNU", prenom: "Sébastien", nom: "Lecornu", debut: "2025-09-09", fin: "2025-10-09" },
    { acteur_uid: "PA_LECORNU", prenom: "Sébastien", nom: "Lecornu", debut: "2025-10-10", fin: null },
];

export const membre = (
    acteur_uid: string,
    nom: string,
    code_qualite: string,
    debut: string,
    fin: string | null = null,
    est_depute = true,
): MembreGouvernementRow => ({ acteur_uid, prenom: "P.", nom, code_qualite, lib_qualite: code_qualite, debut, fin, est_depute });

export const fonction = (
    acteur_uid: string,
    nom: string,
    type_organe: FonctionAssembleeRow["type_organe"],
    code_qualite: string,
    organe_uid = "PO1",
    groupe: { code: string; libelle: string } | null = null,
): FonctionAssembleeRow => ({
    acteur_uid, prenom: "P.", nom, type_organe, code_qualite, organe_uid,
    groupe_code: groupe?.code ?? null, groupe_libelle: groupe?.libelle ?? null,
});

export function makeRepository(overrides: Partial<ILegislatureOrganisationRepository> = {}): ILegislatureOrganisationRepository {
    return {
        getLegislatures: jest.fn().mockResolvedValue(LEGISLATURES),
        getPremiersMinistres: jest.fn().mockResolvedValue(PREMIERS_MINISTRES),
        getPresidentsAssemblee: jest.fn().mockResolvedValue([]),
        getMembresGouvernement: jest.fn().mockResolvedValue([]),
        getFonctionsAssemblee: jest.fn().mockResolvedValue([]),
        getChiffres: jest.fn().mockResolvedValue(null),
        getEntreesEnCours: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}
