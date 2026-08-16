import { ScrutinParticipationPointEntity } from "@/app/domains/scrutins/entities/scrutin-participation-evolution.entity";

export interface IScrutinsStatsRepository {
    /** Taux de participation moyen (nombre_votants / (nombre_votants + non_votants)), un point par mois. */
    getParticipationEvolution(): Promise<ScrutinParticipationPointEntity[]>;

    /**
     * Nombre total de scrutins (= de votes solennels/publics organisés) —
     * pas le nombre de votes individuels des député·es. `legislature` omise
     * = toutes législatures confondues : le domaine "scrutins" n'a pas
     * d'EntityResolver (voir ENTITY_RESOLVERS), donc pas de filtre
     * législature disponible en mode Statistiques avancées — cette stat doit
     * rester utilisable seule.
     */
    countScrutins(legislature?: number): Promise<number>;
}
