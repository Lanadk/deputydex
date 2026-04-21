import {prisma} from "@/app/infrastructure/db/prisma/prisma";
import {IGroupeMembersRepository} from "@/app/domains/groupes/repositories/IGroupeMembersRepository";

export type GroupeMembersRow = {
    first_name: string;
    last_name: string;
    since: Date;
    circonscription: string
    age: number;
}

export const prismaGroupeMembersRepository: IGroupeMembersRepository = {

    async getGroupeMembers(code: string, legislature: number): Promise<GroupeMembersRow[]> {
        try {
            return await prisma.$queryRaw<GroupeMembersRow[]>`
                SELECT a.prenom                                                    AS first_name,
                       a.nom                                                       AS last_name,
                       ag.date_debut                                               AS since,
                       DATE_PART('year', AGE(CURRENT_DATE, a.date_naissance))::int AS age,
                    CONCAT(m.election_departement, ' - ', m.election_num_circo, 'e circ.') AS circonscription
                FROM acteurs_groupes ag
                         INNER JOIN acteurs a
                                    ON a.uid = ag.acteur_uid
                         INNER JOIN ref_groupes rg
                                    ON rg.groupe_id = ag.groupe_id
                                        AND rg.groupe_legislature = ag.groupe_legislature
                         LEFT JOIN LATERAL (
                            SELECT mv.election_departement,
                                   mv.election_num_circo
                            FROM mandats mv
                            WHERE mv.acteur_uid = a.uid
                              AND mv.legislature = ag.groupe_legislature
                              AND mv.type_organe = 'ASSEMBLEE'
                            ORDER BY mv.date_debut DESC
                                LIMIT 1
                         ) m ON true
                WHERE rg.code = ${code}
                  AND ag.groupe_legislature = ${legislature}
                  AND ag.date_debut <= CURRENT_DATE
                  AND (ag.date_fin IS NULL OR ag.date_fin >= CURRENT_DATE)
                ORDER BY a.nom, a.prenom
            `;

        } catch (error) {
            console.error("Error fetching group infos:", error);
            throw new Error("Failed to fetch group infos");
        }
    }
}