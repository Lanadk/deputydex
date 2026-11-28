import {
    AssembleePresenceJourRow,
    AssembleePresenceJourSemaineRow,
    AssembleePresenceLegislatureRow,
    AssembleePresenceMoisRow,
    DeputeDebutMandatRow,
    DeputePresenceLegislatureRow,
    DeputePresenceMoisRow,
    GroupePresenceAnneeRow,
    GroupePresenceMoisRow,
    GroupePresenceRow,
    PresenceAnneeRow,
    PresenceTypePeriode,
} from "@/app/domains/presence/entities/presence-stats.entity";

/**
 * Port des statistiques de présence : lookups sur les vues `agg_*_presence*`
 * de deputydex-data (aucun recalcul ici, voir CLAUDE.md). Les méthodes « député »
 * couvrent toutes ses législatures (un député ne se choisit pas par législature
 * dans le mode avancé) ; celles de l'Assemblée prennent une législature
 * optionnelle (absente = toutes).
 */
export interface IPresenceStatsRepository {
    // Député : toutes ses législatures, ou une seule si `legislature` est donnée (fiche député).
    getDeputeParLegislature(acteurUid: string, legislature?: number): Promise<DeputePresenceLegislatureRow[]>;
    getDeputeMensuelle(acteurUid: string, legislature?: number): Promise<DeputePresenceMoisRow[]>;
    getDeputeAnnuelle(acteurUid: string, type: PresenceTypePeriode, legislature?: number): Promise<PresenceAnneeRow[]>;
    /** Prise de fonction du député, une ligne par législature où il a siégé. */
    getDeputeDebutsMandat(acteurUid: string, legislature?: number): Promise<DeputeDebutMandatRow[]>;

    getGroupes(legislature: number): Promise<GroupePresenceRow[]>;
    getGroupesMensuelle(legislature: number): Promise<GroupePresenceMoisRow[]>;
    getGroupeMensuelle(code: string, legislature: number): Promise<GroupePresenceMoisRow[]>;
    getGroupesAnnuelle(legislature: number, type: Exclude<PresenceTypePeriode, "mandat">): Promise<GroupePresenceAnneeRow[]>;

    getAssemblee(legislature?: number): Promise<AssembleePresenceLegislatureRow[]>;
    getAssembleeMensuelle(legislature?: number): Promise<AssembleePresenceMoisRow[]>;
    /** `mandat` : agrégé par rang d'année dans le mandat de chaque député (voir la vue). */
    getAssembleeAnnuelle(type: PresenceTypePeriode, legislature?: number): Promise<PresenceAnneeRow[]>;
    getAssembleeJournaliere(legislature?: number): Promise<AssembleePresenceJourRow[]>;
    getAssembleeJourSemaine(legislature?: number): Promise<AssembleePresenceJourSemaineRow[]>;
}
