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
    FonctionDefinitionDTO,
    GouvernementDTO,
    LegislatureOrganisationDTO,
    RangGouvernementDTO,
    SessionAssembleeDTO,
} from "@/app/domains/legislatures/dto/legislature-organisation.dto";
import {
    chevauche,
    contient,
    EN_MISSION,
    exerceePendantLaSession,
    FONCTIONS_BUREAU,
    libelleMandat,
    libelleSession,
    nommerGouvernements,
    PREMIER_MINISTRE,
    RANGS_GOUVERNEMENT,
    SessionPeriode,
    sessionsDeLaLegislature,
} from "@/app/domains/legislatures/institutions";
import {
    mapFonctionAssembleeToDTO,
    mapMembreGouvernementToDTO,
    mapPremierMinistreToDTO,
    mapPresidentCommissionToDTO,
    mapPresidentGroupeToDTO,
    photoCredit,
} from "@/app/domains/legislatures/mappers/legislature-organisation.mapper";

const parNom = <T extends { nom: string }>(a: T, b: T) => a.nom.localeCompare(b.nom, "fr");

/**
 * Un seul mandat par personne : le plus récent. Une personne peut en avoir
 * plusieurs dans un même rang d'un même gouvernement (changement de portefeuille
 * lors d'un remaniement) ; c'est le dernier qui dit si elle est encore en poste.
 */
export function dernierMandatParPersonne(membres: MembreGouvernementRow[]): MembreGouvernementRow[] {
    const derniers = new Map<string, MembreGouvernementRow>();
    for (const m of membres) {
        const connu = derniers.get(m.acteur_uid);
        if (!connu || m.debut.localeCompare(connu.debut) > 0) derniers.set(m.acteur_uid, m);
    }
    return [...derniers.values()];
}

/**
 * Membres de chaque rang (Ministres d'État, Ministres…), par ordre alphabétique,
 * chaque personne une fois par rang ; les rangs vides sont omis. Les
 * parlementaires « en mission » et le Premier ministre (présenté à part) n'en
 * font pas partie.
 */
export function rangsDuGouvernement(membres: MembreGouvernementRow[], finGouvernement: string | null): RangGouvernementDTO[] {
    return RANGS_GOUVERNEMENT
        .map((r) => ({
            rang: r.rang,
            libelle: r.libelle,
            membres: dernierMandatParPersonne(membres.filter((m) => (r.qualites as readonly string[]).includes(m.code_qualite)))
                .map((m) => mapMembreGouvernementToDTO(m, finGouvernement))
                .sort(parNom),
        }))
        .filter((r) => r.membres.length > 0);
}

/**
 * Un seul mandat par personne et par fonction (même organe) : le plus récent,
 * qui dit si elle l'exerce encore (ex. vice-président réélu sans interruption).
 */
export function dernierMandatParFonction(fonctions: FonctionAssembleeRow[]): FonctionAssembleeRow[] {
    const derniers = new Map<string, FonctionAssembleeRow>();
    for (const f of fonctions) {
        const cle = `${f.acteur_uid}|${f.type_organe}|${f.code_qualite}|${f.organe_uid}`;
        const connu = derniers.get(cle);
        if (!connu || f.debut.localeCompare(connu.debut) > 0) derniers.set(cle, f);
    }
    return [...derniers.values()];
}

/**
 * Bureau et présidences de l'Assemblée pendant une session : tous ceux qui y ont
 * exercé une fonction (avec leur date de départ s'ils l'ont quittée en cours de
 * session), chaque liste par ordre alphabétique (groupes, commissions : par
 * intitulé). Président : le plus récent de la session.
 */
export function organisationAssemblee(fonctions: FonctionAssembleeRow[], session: SessionPeriode, aujourdhui: string): AssembleeOrganisationDTO {
    const finSession = session.fin ?? aujourdhui;
    const exercees = dernierMandatParFonction(fonctions.filter((f) => exerceePendantLaSession(f, session, aujourdhui)));
    const bureau = (qualite: string) => exercees.filter((f) => f.type_organe === "BUREAU" && f.code_qualite === qualite);
    const membresBureau = (qualite: string, fonction: string) => bureau(qualite)
        .map((f) => mapFonctionAssembleeToDTO(f, fonction, finSession))
        .sort(parNom);
    const president = [...bureau(FONCTIONS_BUREAU.president)].sort((a, b) => b.debut.localeCompare(a.debut))[0];

    return {
        president: president ? mapFonctionAssembleeToDTO(president, "Présidence de l'Assemblée", finSession) : null,
        vicePresidents: membresBureau(FONCTIONS_BUREAU.vicePresident, "Vice-présidence"),
        questeurs: membresBureau(FONCTIONS_BUREAU.questeur, "Questure"),
        secretaires: membresBureau(FONCTIONS_BUREAU.secretaire, "Secrétariat"),
        presidentsGroupe: exercees
            .filter((f) => f.type_organe === "GP")
            .map((f) => mapPresidentGroupeToDTO(f, finSession))
            .sort((a, b) => (a.groupeLibelle ?? "").localeCompare(b.groupeLibelle ?? "", "fr") || parNom(a, b)),
        presidentsCommission: exercees
            .filter((f) => f.type_organe === "COMPER")
            .map((f) => mapPresidentCommissionToDTO(f, finSession))
            .sort((a, b) => a.commission.localeCompare(b.commission, "fr") || parNom(a, b)),
    };
}

/** Sessions de l'Assemblée, de la plus récente à la plus ancienne. */
export function sortSessions(sessions: SessionAssembleeDTO[]): SessionAssembleeDTO[] {
    return [...sessions].sort((a, b) => b.debut.localeCompare(a.debut));
}

/** Organisation de l'Assemblée, session par session, pendant la législature [debut, fin]. */
export function sessionsAssemblee(
    fonctions: FonctionAssembleeRow[],
    debut: string,
    fin: string | null,
    aujourdhui: string
): SessionAssembleeDTO[] {
    return sortSessions(sessionsDeLaLegislature(debut, fin, aujourdhui).map((s) => ({
        id: `session-${s.annee}`,
        libelle: libelleSession(s.annee),
        debut: s.debut,
        fin: s.fin,
        ...organisationAssemblee(fonctions, s, aujourdhui),
    })));
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
    const read = await fromRepository(() => Promise.all([
        repository.getLegislatures(),
        repository.getPremiersMinistres(),
        repository.getMandatsPresidentiels(),
    ]));
    if (isErr(read)) return read;
    const [legislatures, premiersMinistres, mandatsPresidentiels] = read.data;

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

    const presidence = mandatsPresidentiels.find((m) => contient(m.debut, m.fin, dateReference));
    const definitions = await lireDefinitions(repository);

    return ok({
        legislature,
        dateReference,
        presidence: presidence
            ? {
                president: presidence.president,
                mandat: libelleMandat(presidence.mandat_numero),
                depuis: presidence.debut,
                photoUrl: presidence.photo_path,
                photoCredit: photoCredit(presidence),
            }
            : null,
        gouvernements: gouvernementsDeLaLegislature(premiersMinistres, membres, periode.debut, dateReference, aujourdhui),
        sessions: sessionsAssemblee(fonctions, periode.debut, periode.fin, aujourdhui),
        definitions,
    });
}

/**
 * Définitions des fonctions, par clé. Complément facultatif : si le référentiel
 * ne peut pas être lu, l'organigramme s'affiche sans bulles plutôt qu'en erreur.
 */
async function lireDefinitions(repository: ILegislatureOrganisationRepository): Promise<Record<string, FonctionDefinitionDTO>> {
    const read = await fromRepository(() => repository.getFonctionsDefinitions());
    if (isErr(read)) return {};
    return Object.fromEntries(read.data.map((d) => [d.slug, { libelle: d.libelle, definition: d.definition, source: d.source }]));
}
