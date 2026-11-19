"server-only";

import { IScrutinListRepository } from "@/app/domains/scrutins/repositories/IScrutinListRepository";
import { ScrutinListFilters } from "@/app/domains/scrutins/filters/scrutin-list.filters";
import { ScrutinListItemEntity, ScrutinListPageEntity } from "@/app/domains/scrutins/entities/scrutin-list-item.entity";
import { Prisma } from "@/app/infrastructure/db/generated/prisma";
import { prisma } from "@/app/infrastructure/db/prisma/prisma";

/**
 * Objet du scrutin déduit du début de son titre, très régulier dans l'open data AN
 * (« l'ensemble du projet de loi… », « l'amendement n° 12… », « l'article 3… »).
 * Provisoire : à remplacer par la colonne calculée côté deputydex-data (issue #170, étape 1).
 */
const OBJET_SQL = Prisma.sql`
    CASE
        WHEN s.titre ~* '^l[''’]ensemble'                           THEN 'ensemble'
        WHEN s.titre ~* '^(l[''’]|les |le |la )?(sous-)?amende?m+e?n?ts?' THEN 'amendement'
        WHEN s.titre ~* '^(l[''’]|les |le |la )?articles?'          THEN 'article'
        WHEN s.titre ~* 'motion'                                    THEN 'motion'
        ELSE 'autre'
    END
`;

/** Titre en minuscules, sans accents ni apostrophe typographique, comparable à `filters.recherche`. */
const TITRE_NORMALISE_SQL = Prisma.sql`
    translate(lower(s.titre), 'àâäáãéèêëíìîïóòôöõúùûüçñ’', 'aaaaaeeeeiiiiooooouuuucn''')
`;

function whereClause(filters: ScrutinListFilters): Prisma.Sql {
    const conditions: Prisma.Sql[] = [Prisma.sql`s.legislature_snapshot = ${filters.legislature}`];

    if (filters.portee === "importants") {
        conditions.push(Prisma.sql`(s.type_scrutin_code IN ('SPS', 'MOC') OR ${OBJET_SQL} = 'ensemble')`);
    }
    if (filters.recherche) {
        conditions.push(Prisma.sql`${TITRE_NORMALISE_SQL} LIKE ${"%" + filters.recherche + "%"}`);
    }
    if (filters.resultat) {
        conditions.push(Prisma.sql`s.resultat_code = ${filters.resultat === "adopte" ? "adopté" : "rejeté"}`);
    }
    if (filters.type) {
        conditions.push(Prisma.sql`s.type_scrutin_code = ${filters.type}`);
    }
    if (filters.objet) {
        conditions.push(Prisma.sql`${OBJET_SQL} = ${filters.objet}`);
    }

    return Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`;
}

export const prismaScrutinListRepository: IScrutinListRepository = {
    async getScrutinsPage(filters: ScrutinListFilters): Promise<ScrutinListPageEntity> {
        const where = whereClause(filters);
        const offset = (filters.page - 1) * filters.pageSize;

        // La pagination se fait en base : l'ordre (plus récent d'abord) est donc fixé ici.
        const [rows, [{ total }]] = await Promise.all([
            prisma.$queryRaw<ScrutinListItemEntity[]>`
                SELECT
                    s.uid,
                    s.numero,
                    s.date_scrutin,
                    s.titre,
                    s.type_scrutin_code,
                    s.resultat_code,
                    ${OBJET_SQL} AS objet,
                    a.total_pour,
                    a.total_contre,
                    a.total_abstentions
                FROM scrutins s
                LEFT JOIN scrutins_agregats a
                    ON a.scrutin_uid = s.uid
                ${where}
                ORDER BY s.date_scrutin DESC NULLS LAST,
                         NULLIF(regexp_replace(s.numero, '\D', '', 'g'), '')::int DESC NULLS LAST,
                         s.uid DESC
                LIMIT ${filters.pageSize} OFFSET ${offset}
            `,
            prisma.$queryRaw<{ total: number }[]>`
                SELECT COUNT(*)::int AS total
                FROM scrutins s
                ${where}
            `,
        ]);

        return { rows, total };
    },
};
