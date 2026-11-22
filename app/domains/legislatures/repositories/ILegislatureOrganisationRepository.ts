import {
    EntreeEnCoursRow,
    EvenementInstitutionnelRow,
    FonctionAssembleeRow,
    MandatPresidentielRow,
    LegislatureChiffresRow,
    LegislaturePeriodeRow,
    MembreGouvernementRow,
    PremierMinistreRow,
    PresidentAssembleeRow,
} from "@/app/domains/legislatures/entities/legislature-organisation.entity";

/** Lecture de l'organisation institutionnelle (exécutif, Assemblée) autour des législatures. */
export interface ILegislatureOrganisationRepository {
    getLegislatures(): Promise<LegislaturePeriodeRow[]>;
    getPremiersMinistres(): Promise<PremierMinistreRow[]>;
    getPresidentsAssemblee(): Promise<PresidentAssembleeRow[]>;
    /** Nominations au gouvernement dont le début tombe entre `debut` et `fin` (incluses). */
    getMembresGouvernement(debut: string, fin: string): Promise<MembreGouvernementRow[]>;
    /** Bureau, présidents de groupe et de commission permanente en place à `dateReference`. */
    getFonctionsAssemblee(legislature: number, dateReference: string): Promise<FonctionAssembleeRow[]>;
    getChiffres(legislature: number): Promise<LegislatureChiffresRow | null>;
    getEntreesEnCours(legislature: number): Promise<EntreeEnCoursRow[]>;
    /** Référentiel des mandats présidentiels (données hors open data de l'AN). */
    getMandatsPresidentiels(): Promise<MandatPresidentielRow[]>;
    /** Référentiel des événements institutionnels (dissolution, élections…). */
    getEvenementsInstitutionnels(): Promise<EvenementInstitutionnelRow[]>;
}
