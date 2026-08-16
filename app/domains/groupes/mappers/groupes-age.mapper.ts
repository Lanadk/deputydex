import { GroupeStatAgeParGroupeRow } from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";
import { GroupeAgeRowDTO, GroupesAgeDTO } from "@/app/domains/groupes/dto/groupes-age.dto";

/**
 * Même principe que `groupes-feminisation.mapper.ts` : trie par la métrique
 * (ici l'âge moyen, croissant — le plus jeune en premier) et calcule les
 * extrêmes une seule fois, pour ne pas dupliquer cette logique côté UI.
 */
export function mapEntitiesToGroupesAgeDTO(rows: GroupeStatAgeParGroupeRow[]): GroupesAgeDTO {
    const groupes: GroupeAgeRowDTO[] = rows
        .map((row) => ({
            groupeCode: row.groupe_code,
            groupeLabel: row.groupe_label ?? row.groupe_code,
            averageAge: row.average_age,
        }))
        .sort((a, b) => a.averageAge - b.averageAge);

    return {
        groupes,
        plusJeune: groupes[0] ?? null,
        plusAge: groupes.length > 0 ? groupes[groupes.length - 1] : null,
    };
}
