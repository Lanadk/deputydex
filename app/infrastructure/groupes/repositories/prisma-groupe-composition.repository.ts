import {prisma} from "@/app/infrastructure/db/prisma/prisma";
import {IGroupeCompositionRepository} from "@/app/domains/groupes/repositories/IGroupeCompositionRepository";
import {GroupeCompositionEntity} from "@/app/domains/groupes/entities/groupe-composition.entity";

export type ProfessionFamilleRow = {
    profession_famille: string;
    nb_acteurs: number;
    nb_total_groupe: number;
    pct_dans_groupe: number;
};

export type ProfessionCategorieRow = {
    profession_categorie: string;
    nb_acteurs: number;
    nb_total_groupe: number;
    pct_dans_groupe: number;
};

export type AgeRow = {
    average_age: number;
};

export type PariteRow = {
    nb_hommes: number;
    nb_femmes: number;
    nb_total: number;
    pct_hommes: number;
    pct_femmes: number;
};

export type MandatsRow = {
    average_cumulated_years: number;
};

export type DepartemenBirthtRow = {
    departement: string;
    nb_acteurs: number;
    pct_dans_groupe: number;
};

export type DepartementElectionRow = {
    election_departement: string;
    nb_acteurs: number;
    pct_dans_groupe: number;
};

export type PaysNaissanceRow = {
    pays: string;
    nb_acteurs: number;
    pct_dans_groupe: number;
};

export type TrancheAgeRow = {
    tranche_age: string;
    nb_acteurs: number;
    pourcentage: number;
};

export type ExtremeAgeRow = {
    nom: string;
    prenom: string;
    age: number;
};

export const prismaGroupeCompositionRepository: IGroupeCompositionRepository = {

    async getGroupeComposition(groupeCode: string, legislature: number): Promise<GroupeCompositionEntity | null> {
        const [infos, familles, categories, age, parite, mandats, departementsElection, departementsNaissance,
            paysNaissance, trancheAge, plusAge, plusJeune] = await Promise.all([
            prisma.$queryRaw<{ groupe_count_members: number }[]>`
                SELECT groupe_count_members::int
                FROM agg_groupes_fiche_infos
                WHERE groupe_code = ${groupeCode}
                  AND legislature = ${legislature}
                    LIMIT 1
            `,
            prisma.$queryRaw<ProfessionFamilleRow[]>`
                SELECT profession_famille, nb_acteurs, nb_total_groupe, pct_dans_groupe
                FROM agg_groupes_stats_professions_familles
                WHERE groupe_code = ${groupeCode}
                  AND legislature = ${legislature}
                ORDER BY nb_acteurs DESC
            `,
            prisma.$queryRaw<ProfessionCategorieRow[]>`
                SELECT profession_categorie, nb_acteurs, nb_total_groupe, pct_dans_groupe
                FROM agg_groupes_stats_professions_categories
                WHERE groupe_code = ${groupeCode}
                  AND legislature = ${legislature}
                ORDER BY nb_acteurs DESC
            `,
            prisma.$queryRaw<AgeRow[]>`
                SELECT average_age::float
                FROM agg_groupes_stats_age
                WHERE groupe_code = ${groupeCode}
                  AND legislature = ${legislature}
                LIMIT 1
            `,
            prisma.$queryRaw<PariteRow[]>`
                SELECT nb_hommes::int, nb_femmes::int, nb_total::int, pct_hommes::float, pct_femmes::float
                FROM agg_groupes_stats_parite
                WHERE groupe_code = ${groupeCode}
                  AND legislature = ${legislature}
                LIMIT 1
            `,
            prisma.$queryRaw<MandatsRow[]>`
                SELECT average_cumulated_years::float
                FROM agg_groupes_stats_cumul_mandats
                WHERE groupe_code = ${groupeCode}
                  AND legislature = ${legislature}
                LIMIT 1
            `,
            prisma.$queryRaw<DepartementElectionRow[]>`
                SELECT election_departement, nb_acteurs::int, pct_dans_groupe::float
                FROM agg_groupes_stats_geographie_election
                WHERE groupe_code = ${groupeCode}
                  AND legislature = ${legislature}
                ORDER BY nb_acteurs DESC
                LIMIT 5
            `,
            prisma.$queryRaw<DepartemenBirthtRow[]>`
                SELECT departement, nb_acteurs::int, pct_dans_groupe::float
                FROM agg_groupes_stats_geographie_dep_naissance
                WHERE groupe_code = ${groupeCode}
                  AND legislature = ${legislature}
                ORDER BY nb_acteurs DESC
                LIMIT 5
            `,
            prisma.$queryRaw<PaysNaissanceRow[]>`
                SELECT pays, nb_acteurs::int, pct_dans_groupe::float
                FROM agg_groupes_stats_geographie_pays_naissance
                WHERE groupe_code = ${groupeCode}
                  AND legislature = ${legislature}
                  AND pays IS NOT NULL
                ORDER BY nb_acteurs DESC
                LIMIT 5
            `,
            prisma.$queryRaw<TrancheAgeRow[]>`
                SELECT tranche_age, nb_acteurs::int, pourcentage::float
                FROM agg_groupes_stats_tranche_age
                WHERE groupe_code = ${groupeCode}
                  AND legislature = ${legislature}
                ORDER BY 
                    CASE
                        WHEN tranche_age = '<30' THEN 1
                        WHEN tranche_age = '30-39' THEN 2
                        WHEN tranche_age = '40-49' THEN 3
                        WHEN tranche_age = '50-59' THEN 4
                        WHEN tranche_age = '60-69' THEN 5
                        ELSE 6
                    END
            `,
            prisma.$queryRaw<ExtremeAgeRow[]>`
                SELECT a.nom, a.prenom,
                       EXTRACT(YEAR FROM AGE(a.date_naissance))::int AS age
                FROM acteurs a
                JOIN acteurs_groupes ag ON ag.acteur_uid = a.uid
                WHERE ag.groupe_id = (
                    SELECT groupe_id FROM ref_groupes 
                    WHERE code = ${groupeCode} AND groupe_legislature = ${legislature}
                )
                  AND ag.groupe_legislature = ${legislature}
                ORDER BY age DESC
                LIMIT 1
            `,
            prisma.$queryRaw<ExtremeAgeRow[]>`
                SELECT a.nom, a.prenom,
                       EXTRACT(YEAR FROM AGE(a.date_naissance))::int AS age
                FROM acteurs a
                JOIN acteurs_groupes ag ON ag.acteur_uid = a.uid
                WHERE ag.groupe_id = (
                    SELECT groupe_id FROM ref_groupes 
                    WHERE code = ${groupeCode} AND groupe_legislature = ${legislature}
                )
                  AND ag.groupe_legislature = ${legislature}
                ORDER BY age ASC
                LIMIT 1
            `,
        ]);

        return {
            groupeCountMembers: infos[0]?.groupe_count_members ?? null,
            averageAge: age[0]?.average_age ?? null,
            averageCumulatedYears: mandats[0]?.average_cumulated_years ?? null,
            parite: parite[0] ?? null,
            topDepartementsElection: departementsElection,
            topDepartementsNaissance: departementsNaissance,
            topPaysNaissance: paysNaissance,
            professionFamilles: familles,
            professionCategories: categories,
            trancheAge: trancheAge,
            extremes: {
                plusAge: plusAge[0],
                plusJeune: plusJeune[0],
            },
        };
    },
}