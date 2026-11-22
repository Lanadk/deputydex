import "server-only";

import { prisma } from "@/app/infrastructure/db/prisma/prisma";
import { IPresidenceAssembleeRepository } from "@/app/domains/legislatures/repositories/IPresidenceAssembleeRepository";
import { PresidenceAssembleeEntity } from "@/app/domains/legislatures/entities/presidence-assemblee.entity";

export const prismaPresidenceAssembleeRepository: IPresidenceAssembleeRepository = {
    async getPresidencesAssemblee(legislature: number): Promise<PresidenceAssembleeEntity[]> {
        // Président du Bureau (pas le « Président d'âge » de la séance d'installation).
        // Dates formatées en SQL : aucune conversion de fuseau horaire. Le use-case choisit le mandat.
        try {
            return await prisma.$queryRaw<PresidenceAssembleeEntity[]>`
                SELECT m.acteur_uid, a.prenom, a.nom,
                       to_char(m.date_debut, 'YYYY-MM-DD') AS debut,
                       to_char(m.date_fin, 'YYYY-MM-DD')   AS fin
                FROM mandats m
                JOIN acteurs a ON a.uid = m.acteur_uid
                WHERE m.legislature = ${legislature}
                  AND m.type_organe = 'BUREAU'
                  AND m.code_qualite = 'Président'
            `;
        } catch (error) {
            throw new Error(`Lecture de la présidence de l'Assemblée (législature ${legislature}) impossible`, { cause: error });
        }
    },
};
