import { ScrutinListItemEntity } from "@/app/domains/scrutins/entities/scrutin-list-item.entity";

/** Scrutins d'une période et ses bornes (dates du jour, minuit UTC). */
export type ScrutinsPeriodeEntity = {
    debut: Date;
    fin: Date;
    rows: ScrutinListItemEntity[];
};

export interface IScrutinsPeriodeRepository {
    /**
     * Scrutins des 30 jours qui finissent au dernier scrutin de la législature
     * (même fenêtre que `agg_deputes_tendances_recentes`) ; `null` si la
     * législature n'a aucun scrutin daté.
     */
    getScrutinsDernierMois(legislature: number): Promise<ScrutinsPeriodeEntity | null>;
}
