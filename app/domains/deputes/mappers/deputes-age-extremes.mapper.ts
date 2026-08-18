import { DeputeAgeRow } from "@/app/domains/deputes/entities/depute-age.entity";
import { DeputesAgeExtremesDTO } from "@/app/domains/deputes/dto/deputes-age-extremes.dto";

/**
 * `rows` vient de `getAgeExtremes` : [0] = le/la plus jeune, [1] = le/la plus
 * âgé·e (UNION ALL de deux requêtes bornées, voir prisma-deputes-age.repository.ts).
 * Si un seul député a un âge connu cette législature, les deux requêtes
 * renvoient la même ligne — `plusAge` est alors null plutôt que de dupliquer
 * la même personne dans les deux cartes (même garde que `moinsFeminise` dans
 * groupes-feminisation.mapper.ts).
 */
export function mapEntitiesToDeputesAgeExtremesDTO(rows: DeputeAgeRow[]): DeputesAgeExtremesDTO {
    const [youngest, oldest] = rows;

    const plusJeune = youngest ? { deputeUid: youngest.depute_uid, age: youngest.age } : null;
    const plusAge =
        oldest && oldest.depute_uid !== youngest?.depute_uid ? { deputeUid: oldest.depute_uid, age: oldest.age } : null;

    return { plusJeune, plusAge };
}
