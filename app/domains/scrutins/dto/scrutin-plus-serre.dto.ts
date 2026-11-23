import { ScrutinListItemDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";

/**
 * Le scrutin le plus serré du mois (30 jours qui finissent au dernier scrutin
 * de la législature ; dates AAAA-MM-JJ). `periode` null : aucun scrutin daté ;
 * `scrutin` null : aucun scrutin assez suivi sur la période.
 */
export type ScrutinPlusSerreDTO = {
    periode: { debut: string; fin: string } | null;
    scrutin: ScrutinListItemDTO | null;
    /** Écart en voix entre pour et contre. */
    ecart: number | null;
};
