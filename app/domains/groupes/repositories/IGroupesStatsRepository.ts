import {
    GroupeFeminisationMouvementRow,
    GroupeStatCohesionPointEntity,
    GroupeStatEffectifRow,
    GroupeStatPariteEntity,
    GroupeStatPariteParGroupeRow,
} from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";

export interface IGroupesStatsRepository {
    getParite(code: string, legislature: number): Promise<GroupeStatPariteEntity>;

    /** Parité hommes/femmes agrégée sur TOUS les groupes d'une législature (la "moyenne" du domaine) — utilisé par les insights, pas exposé comme stat du catalogue. */
    getPariteMoyenne(legislature: number): Promise<GroupeStatPariteEntity>;

    getEffectifs(legislature: number): Promise<GroupeStatEffectifRow[]>;

    getCohesionEvolution(code: string, legislature: number): Promise<GroupeStatCohesionPointEntity[]>;

    /**
     * Parité, une ligne par groupe POLITIQUE de la législature (Non inscrits
     * exclu — ce n'est pas un groupe politique) — pour un classement, pas
     * pour un seul groupe (voir `getParite`). Source : `agg_groupes_stats_parite`,
     * comme `getParite`/`getPariteMoyenne`.
     */
    getPariteParGroupe(legislature: number): Promise<GroupeStatPariteParGroupeRow[]>;

    /**
     * Combien de femmes chaque groupe politique a intégrées/perdues DURANT la
     * législature (hors composition initiale du jour de constitution du
     * groupe) — voir la méthodologie dans `feminisation-groupes.sections.ts`
     * pour la définition exacte ("intégré" / "perdu").
     */
    getFeminisationMouvements(legislature: number): Promise<GroupeFeminisationMouvementRow[]>;
}
