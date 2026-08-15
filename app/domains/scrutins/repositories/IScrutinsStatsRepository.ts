import { ScrutinParticipationPointEntity } from "@/app/domains/scrutins/entities/scrutin-participation-evolution.entity";

export interface IScrutinsStatsRepository {
    /** Taux de participation moyen (nombre_votants / (nombre_votants + non_votants)), un point par mois. */
    getParticipationEvolution(): Promise<ScrutinParticipationPointEntity[]>;
}
