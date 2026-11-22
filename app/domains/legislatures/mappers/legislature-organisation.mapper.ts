import {
    FonctionAssembleeRow,
    MembreGouvernementRow,
    PremierMinistreRow,
    PresidentAssembleeRow,
} from "@/app/domains/legislatures/entities/legislature-organisation.entity";
import {
    MembreGouvernementDTO,
    PersonneFonctionDTO,
    PresidentCommissionDTO,
    PresidentGroupeDTO,
} from "@/app/domains/legislatures/dto/legislature-organisation.dto";
import { FrisePeriodeDTO } from "@/app/domains/legislatures/dto/legislatures-frise.dto";
import { commissionPermanenteLabel } from "@/app/domains/legislatures/references/commissions-permanentes";
import { libelleLegislature } from "@/app/domains/legislatures/institutions";

const nomComplet = (row: { prenom: string; nom: string }) => `${row.prenom} ${row.nom}`;
const ficheDepute = (uid: string) => `/deputes/${uid}`;

type IdentiteRow = { photo_path: string | null; appartenance_code: string | null; appartenance_libelle: string | null };

/** Photo et groupe politique d'une personne. */
function identite(row: IdentiteRow): Pick<PersonneFonctionDTO, "photoUrl" | "groupe"> {
    return {
        photoUrl: row.photo_path,
        groupe: row.appartenance_code ? { code: row.appartenance_code, libelle: row.appartenance_libelle ?? row.appartenance_code } : null,
    };
}

/** Une fonction à l'Assemblée (Bureau) : toujours un député, donc une fiche. */
export function mapFonctionAssembleeToDTO(row: FonctionAssembleeRow, fonction: string): PersonneFonctionDTO {
    return { uid: row.acteur_uid, nom: nomComplet(row), fonction, href: ficheDepute(row.acteur_uid), ...identite(row) };
}

export function mapPresidentGroupeToDTO(row: FonctionAssembleeRow): PresidentGroupeDTO {
    return {
        ...mapFonctionAssembleeToDTO(row, "Présidence de groupe"),
        groupeCode: row.groupe_code,
        groupeLibelle: row.groupe_libelle,
    };
}

export function mapPresidentCommissionToDTO(row: FonctionAssembleeRow): PresidentCommissionDTO {
    return {
        ...mapFonctionAssembleeToDTO(row, "Présidence de commission"),
        commission: commissionPermanenteLabel(row.organe_uid),
    };
}

/** Le Premier ministre d'un gouvernement. */
export function mapPremierMinistreToDTO(row: PremierMinistreRow, estDepute: boolean): PersonneFonctionDTO {
    return {
        uid: row.acteur_uid,
        nom: nomComplet(row),
        fonction: "Premier ministre",
        href: estDepute ? ficheDepute(row.acteur_uid) : null,
        ...identite(row),
    };
}

/**
 * Un membre du gouvernement ; `jusqua` est renseigné s'il a quitté le
 * gouvernement avant la fin de celui-ci (remaniement, démission…).
 */
export function mapMembreGouvernementToDTO(row: MembreGouvernementRow, finGouvernement: string | null): MembreGouvernementDTO {
    const parti = row.fin !== null && (finGouvernement === null || row.fin < finGouvernement);
    return {
        uid: row.acteur_uid,
        nom: nomComplet(row),
        fonction: row.lib_qualite,
        href: row.est_depute ? ficheDepute(row.acteur_uid) : null,
        ...identite(row),
        jusqua: parti ? row.fin : null,
    };
}

/** Un gouvernement, comme période de la frise. */
export function mapGouvernementToPeriode(row: PremierMinistreRow & { libelle: string }): FrisePeriodeDTO {
    return {
        id: `gouvernement-${row.debut}`,
        libelle: row.libelle,
        detail: `Premier ministre : ${nomComplet(row)}`,
        debut: row.debut,
        fin: row.fin,
        href: null,
    };
}

/** Une présidence de l'Assemblée, comme période de la frise. */
export function mapPresidentAssembleeToPeriode(row: PresidentAssembleeRow): FrisePeriodeDTO {
    return {
        id: `assemblee-${row.legislature}-${row.debut}`,
        libelle: nomComplet(row),
        detail: `Présidence de l'Assemblée, ${libelleLegislature(row.legislature)}`,
        debut: row.debut,
        fin: row.fin,
        href: ficheDepute(row.acteur_uid),
    };
}
