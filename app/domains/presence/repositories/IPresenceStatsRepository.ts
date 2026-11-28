import {
    AssembleePresenceJourRow,
    AssembleePresenceJourSemaineRow,
    AssembleePresenceLegislatureRow,
    AssembleePresenceMoisRow,
    DebutLegislatureRow,
    DeputeDebutMandatRow,
    DeputePresenceLegislatureRow,
    DeputePresenceMoisRow,
    GroupePresenceAnneeRow,
    GroupePresenceMoisRow,
    GroupePresenceRow,
    PresenceAnneeRow,
    PresenceTypePeriode,
} from "@/app/domains/presence/entities/presence-stats.entity";
import { PerimetreLegislature } from "@/app/_shared/statistics/perimetre-legislature";

/**
 * Port des statistiques de présence : lookups sur les vues `agg_*_presence*`
 * de deputydex-data (aucun recalcul ici, voir CLAUDE.md).
 *
 * Assemblée, `perimetre` : un numéro = cette législature ; `"toutes"` = la
 * ligne toutes législatures confondues des vues (legislature IS NULL) ;
 * absent = une ligne par législature (pour les comparer).
 */
export interface IPresenceStatsRepository {
    // Député, `perimetre` : absent = une ligne par législature ; un numéro = cette législature
    // (fiche député) ; « toutes » = ses législatures confondues (lignes legislature IS NULL).
    getDeputeParLegislature(acteurUid: string, perimetre?: PerimetreLegislature): Promise<DeputePresenceLegislatureRow[]>;
    getDeputeMensuelle(acteurUid: string, perimetre?: PerimetreLegislature): Promise<DeputePresenceMoisRow[]>;
    getDeputeAnnuelle(acteurUid: string, type: PresenceTypePeriode, perimetre?: PerimetreLegislature): Promise<PresenceAnneeRow[]>;
    /** Prise de fonction du député, une ligne par législature où il a siégé. */
    getDeputeDebutsMandat(acteurUid: string, legislature?: number): Promise<DeputeDebutMandatRow[]>;

    // Groupes, `perimetre` : un numéro = cette législature ; « toutes » = les groupes de chaque
    // législature, côte à côte (pas de fusion : un groupe n'est pas identifiable d'une législature à l'autre).
    getGroupes(perimetre: PerimetreLegislature): Promise<GroupePresenceRow[]>;
    getGroupesMensuelle(perimetre: PerimetreLegislature): Promise<GroupePresenceMoisRow[]>;
    getGroupeMensuelle(code: string, legislature: number): Promise<GroupePresenceMoisRow[]>;
    getGroupesAnnuelle(perimetre: PerimetreLegislature, type: Exclude<PresenceTypePeriode, "mandat">): Promise<GroupePresenceAnneeRow[]>;

    getAssemblee(perimetre?: PerimetreLegislature): Promise<AssembleePresenceLegislatureRow[]>;
    getAssembleeMensuelle(perimetre?: PerimetreLegislature): Promise<AssembleePresenceMoisRow[]>;
    /** `mandat` : agrégé par rang d'année dans le mandat de chaque député ; jamais en « toutes » (voir la vue). */
    getAssembleeAnnuelle(type: PresenceTypePeriode, perimetre?: PerimetreLegislature): Promise<PresenceAnneeRow[]>;
    getAssembleeJournaliere(perimetre?: PerimetreLegislature): Promise<AssembleePresenceJourRow[]>;
    getAssembleeJourSemaine(perimetre?: PerimetreLegislature): Promise<AssembleePresenceJourSemaineRow[]>;

    /** Début de chaque législature connue (`param_legislatures`), pour les repères des courbes « toutes ». */
    getDebutsLegislatures(): Promise<DebutLegislatureRow[]>;
}
