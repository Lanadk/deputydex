import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";

/** Activité récente d'un député sur la période (voir `DeputesTendancesDTO`). */
export type DeputeTendanceLigneDTO = {
    depute: DeputesCardDTO;
    votesExprimes: number;
    votesRebelles: number;
    amendementsDeposes: number;
};

/** Le député en tête d'un classement, et sa valeur. */
export type DeputeTendanceDTO = {
    depute: DeputesCardDTO;
    valeur: number;
};

/**
 * « Ce mois-ci » : les 30 jours qui finissent au dernier scrutin de la
 * législature (dates AAAA-MM-JJ ; `periode` null s'il n'y a aucune activité).
 */
export type DeputesTendancesDTO = {
    periode: { debut: string; fin: string } | null;
    /** Nombre de scrutins sur la période. */
    scrutins: number;
    /** A pris part au plus grand nombre de scrutins (pour, contre ou abstention). */
    assidu: DeputeTendanceDTO | null;
    /** A le plus souvent voté contre la position majoritaire de son groupe. */
    rebelle: DeputeTendanceDTO | null;
    /** A déposé le plus d'amendements (en auteur). */
    amendements: DeputeTendanceDTO | null;
};
