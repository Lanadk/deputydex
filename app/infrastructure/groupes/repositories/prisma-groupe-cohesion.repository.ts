import {prisma} from "@/app/infrastructure/db/prisma/prisma";
import {IGroupeCohesionRepository} from "@/app/domains/groupes/repositories/IGroupeCohesionRepository";
import {GroupeCohesionEntity} from "@/app/domains/groupes/entities/groupe-cohesion.entity";
import {
    getGroupeGouvernementReferenceCode
} from "@/app/domains/groupes/constants/groupe-gouvernement-reference.constants";

export type EvolutionCohesionLegislatureRow = {
    mois: Date;
    taux_cohesion: number | null;
}

export type CohesionLegislatureRow = {
    nb_scrutins_couverts: number;
    taux_cohesion: number | null;
}

export type CouvertureScrutinsRow = {
    nb_scrutins_couverts: number;
    nb_scrutins_legislature: number;
    taux_couverture_scrutins: number | null;
}

export type ParticipationLegislatureRow = {
    taux_participation_legislature: number | null;
}

export type ProximiteGouvernementRow = {
    taux_proximite: number | null;
}

export const prismaGroupeCohesionRepository: IGroupeCohesionRepository = {

    async getGroupeCohesionLegislature(code: string, legislature: number): Promise<GroupeCohesionEntity> {
        try {
            const gouvernementReferenceCode = getGroupeGouvernementReferenceCode(legislature);

            const [evolutionCohesionLegislature, cohesionLegislature, couvertureScrutins, participationLegislature, proximiteGouvernement] = await Promise.all([
                prisma.$queryRaw<EvolutionCohesionLegislatureRow[]>`
                    SELECT mois, taux_cohesion
                    FROM agg_groupes_stats_cohesion_mensuelle
                    WHERE code = ${code}
                      AND legislature = ${legislature}
                    ORDER BY mois ASC
                `,
                prisma.$queryRaw<CohesionLegislatureRow[]>`
                    SELECT nb_scrutins_couverts::int, taux_cohesion::float
                    FROM agg_groupes_stats_cohesion_legislature
                    WHERE code = ${code}
                      AND legislature = ${legislature}
                    LIMIT 1
                `,
                prisma.$queryRaw<CouvertureScrutinsRow[]>`
                    SELECT nb_scrutins_couverts::int, nb_scrutins_legislature::int, taux_couverture_scrutins::float
                    FROM agg_groupes_stats_couverture_scrutins
                    WHERE code = ${code}
                      AND legislature = ${legislature}
                    LIMIT 1
                `,
                prisma.$queryRaw<ParticipationLegislatureRow[]>`
                    SELECT taux_participation_legislature::float
                    FROM agg_groupes_stats_participation_legislature
                    WHERE code = ${code}
                      AND legislature = ${legislature}
                    LIMIT 1
                `,
                !gouvernementReferenceCode
                    ? Promise.resolve<ProximiteGouvernementRow[]>([])
                    : code === gouvernementReferenceCode
                        ? Promise.resolve<ProximiteGouvernementRow[]>([{taux_proximite: 1}])
                        : prisma.$queryRaw<ProximiteGouvernementRow[]>`
                            SELECT taux_proximite::float
                            FROM agg_groupes_stats_proximite_votes_legislature
                            WHERE legislature = ${legislature}
                              AND (
                                (groupe_a_code = ${code} AND groupe_b_code = ${gouvernementReferenceCode})
                                    OR (groupe_a_code = ${gouvernementReferenceCode} AND groupe_b_code = ${code})
                                )
                            LIMIT 1
                        `,
            ]);

            return {
                evolutionCohesionLegislature,
                cohesionLegislature: cohesionLegislature[0] ?? null,
                couvertureScrutins: couvertureScrutins[0] ?? null,
                participationLegislature: participationLegislature[0] ?? null,
                proximiteGouvernement: proximiteGouvernement[0] ?? null,
            };

        } catch (error) {
            console.error("Error fetching group infos:", error);
            throw new Error("Failed to fetch group infos");
        }
    }
}