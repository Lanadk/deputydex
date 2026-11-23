import { DeputesCardEntity } from "@/app/domains/deputes/entities/deputes-cards.entity";

/**
 * Activité récente d'un député (vue `agg_deputes_tendances_recentes`, jointe à
 * sa carte) : sur les 30 jours qui finissent au dernier scrutin de la législature.
 */
export type DeputeTendanceEntity = DeputesCardEntity & {
    periode_debut: Date;
    periode_fin: Date;
    /** Nombre de scrutins dans la fenêtre. */
    scrutins_periode: number;
    /** Votes pour / contre / abstention. */
    votes_exprimes: number;
    /** Votes exprimés contraires à la position majoritaire du groupe. */
    votes_rebelles: number;
    /** Amendements dont le député est l'auteur (pas les co-signatures). */
    amendements_deposes: number;
};
