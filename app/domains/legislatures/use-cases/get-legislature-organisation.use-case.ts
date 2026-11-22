import { err, isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { ILegislatureOrganisationRepository } from "@/app/domains/legislatures/repositories/ILegislatureOrganisationRepository";
import {
    FonctionAssembleeRow,
    MembreGouvernementRow,
    PremierMinistreRow,
} from "@/app/domains/legislatures/entities/legislature-organisation.entity";
import {
    AssembleeOrganisationDTO,
    GouvernementDTO,
    LegislatureOrganisationDTO,
    RangGouvernementDTO,
} from "@/app/domains/legislatures/dto/legislature-organisation.dto";
import { MANDATS_PRESIDENTIELS } from "@/app/domains/legislatures/references/presidence-republique";
import {
    chevauche,
    contient,
    EN_MISSION,
    FONCTIONS_BUREAU,
    nommerGouvernements,
    PREMIER_MINISTRE,
    RANGS_GOUVERNEMENT,
} from "@/app/domains/legislatures/institutions";
import {
    mapFonctionAssembleeToDTO,
    mapMembreGouvernementToDTO,
    mapPremierMinistreToDTO,
    mapPresidentCommissionToDTO,
    mapPresidentGroupeToDTO,
} from "@/app/domains/legislatures/mappers/legislature-organisation.mapper";

const parNom = <T extends { nom: string }>(a: T, b: T) => a.nom.localeCompare(b.nom, "fr");

/**
 * Membres de chaque rang (Ministres d'État, Ministres…), par ordre alphabétique ;
 * les rangs vides sont omis. Les parlementaires « en mission » et le Premier
 * ministre (présenté à part) n'en font pas partie.
 */
export function rangsDuGouvernement(membres: MembreGouvernementRow[], finGouvernement: string | null): RangGouvernementDTO[] {
    return RANGS_GOUVERNEMENT
        .map((r) => ({
            rang: r.rang,
            libelle: r.libelle,
            membres: membres
                .filter((m) => (r.qualites as readonly string[]).includes(m.code_qualite))
                .map((m) => mapMembreGouvernementToDTO(m, finGouvernement))
                .sort(parNom),
        }))
        .filter((r) => r.membres.length > 0);
}

/** Bureau et présidences de l'Assemblée, chaque liste par ordre alphabétique (commissions : par intitulé). */
export function organisationAssemblee(fonctions: FonctionAssembleeRow[]): AssembleeOrganisationDTO {
    const bureau = (qualite: string, fonction: string) => fonctions
        .filter((f) => f.type_organe === "BUREAU" && f.code_qualite === qualite)
        .map((f) => mapFonctionAssembleeToDTO(f, fonction))
        .sort(parNom);
    const presidents = bureau(FONCTIONS_BUREAU.president, "Présidence de l'Assemblée");

    return {
        president: presidents[0] ?? null,
        vicePresidents: bureau(FONCTIONS_BUREAU.vicePresident, "Vice-présidence"),
        questeurs: bureau(FONCTIONS_BUREAU.questeur, "Questure"),
        secretaires: bureau(FONCTIONS_BUREAU.secretaire, "Secrétariat"),
        presidentsGroupe: fonctions
            .filter((f) => f.type_organe === "GP")
            .map(mapPresidentGroupeToDTO)
            .sort((a, b) => (a.groupeLibelle ?? "").localeCompare(b.groupeLibelle ?? "", "fr")),
        presidentsCommission: fonctions
            .filter((f) => f.type_organe === "COMPER")
            .map(mapPresidentCommissionToDTO)
            .sort((a, b) => a.commission.localeCompare(b.commission, "fr")),
    };
}

/**
 * Gouvernements en place pendant la législature, du plus récent au plus ancien,
 * chacun avec les nominations intervenues pendant sa durée.
 */
export function gouvernementsDeLaLegislature(
    premiersMinistres: PremierMinistreRow[],
    membres: MembreGouvernementRow[],
    debutLegislature: string,
    finLegislature: string,
    aujourdhui: string
): GouvernementDTO[] {
    const deputes = new Set(membres.filter((m) => m.est_depute).map((m) => m.acteur_uid));
    return nommerGouvernements(premiersMinistres)
        .filter((g) => chevauche(g.debut, g.fin, debutLegislature, finLegislature))
        .map((g) => {
            const membresDuGouvernement = membres.filter((m) =>
                m.code_qualite !== EN_MISSION
                && m.code_qualite !== PREMIER_MINISTRE
                && contient(g.debut, g.fin ?? aujourdhui, m.debut));
            return {
                id: `gouvernement-${g.debut}`,
                libelle: g.libelle,
                premierMinistre: mapPremierMinistreToDTO(g, deputes.has(g.acteur_uid)),
                debut: g.debut,
                fin: g.fin,
                rangs: rangsDuGouvernement(membresDuGouvernement, g.fin),
            };
        })
        .sort((a, b) => (a.debut < b.debut ? 1 : a.debut > b.debut ? -1 : 0));
}

/**
 * Organisation institutionnelle d'une législature, en place à sa date de fin
 * (ou à `aujourdhui` si elle est en cours). NOT_FOUND : législature inconnue.
 */
export async function getLegislatureOrganisationUseCase(
    repository: ILegislatureOrganisationRepository,
    legislature: number,
    aujourdhui: string
): Promise<Result<LegislatureOrganisationDTO, "DB_ERROR" | "NOT_FOUND">> {
    const read = await fromRepository(() => Promise.all([repository.getLegislatures(), repository.getPremiersMinistres()]));
    if (isErr(read)) return read;
    const [legislatures, premiersMinistres] = read.data;

    const periode = legislatures.find((l) => l.number === legislature);
    if (!periode) return err("NOT_FOUND");
    const dateReference = periode.fin ?? aujourdhui;

    // Nominations depuis le début du premier gouvernement de la législature.
    const premierGouvernement = premiersMinistres.find((p) => chevauche(p.debut, p.fin, periode.debut, dateReference));
    const details = await fromRepository(() => Promise.all([
        repository.getMembresGouvernement(premierGouvernement?.debut ?? periode.debut, dateReference),
        repository.getFonctionsAssemblee(legislature, dateReference),
    ]));
    if (isErr(details)) return details;
    const [membres, fonctions] = details.data;

    const presidence = MANDATS_PRESIDENTIELS.find((m) => m.debut <= dateReference && (m.fin === null || m.fin >= dateReference));

    return ok({
        legislature,
        dateReference,
        presidence: presidence ? { president: presidence.president, mandat: presidence.mandat, depuis: presidence.debut } : null,
        gouvernements: gouvernementsDeLaLegislature(premiersMinistres, membres, periode.debut, dateReference, aujourdhui),
        assemblee: organisationAssemblee(fonctions),
    });
}
