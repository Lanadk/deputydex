import { LegislaturePariteRow } from "@/app/domains/legislatures/entities/legislature-parite-evolution.entity";

export interface ILegislaturesStatsRepository {
    /** Effectifs hommes/femmes cumulés sur tous les groupes, une ligne par législature. */
    getPariteEvolution(): Promise<LegislaturePariteRow[]>;
}
