import {
    GroupeStatCohesionPointEntity,
    GroupeStatEffectifRow,
    GroupeStatExpressionVoteRow,
    GroupeStatPariteEntity,
    GroupeStatPositionVoteRow,
} from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";
import {
    GroupeStatCohesionDTO,
    GroupeStatEffectifsDTO,
    GroupeStatExpressionVotesDTO,
    GroupeStatPariteDTO,
    GroupeStatPositionsVoteDTO,
} from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";

/** Ordre d'affichage fixe des positions, indépendant de l'ordre renvoyé par la vue SQL. */
const POSITION_LABELS: Record<string, string> = {
    pour: "Pour",
    contre: "Contre",
    abstention: "Abstention",
};

export function mapGroupeStatPariteToDTO(entity: GroupeStatPariteEntity): GroupeStatPariteDTO {
    if (!entity) return { items: [] };

    return {
        items: [
            { label: "Hommes", value: entity.nb_hommes },
            { label: "Femmes", value: entity.nb_femmes },
        ],
    };
}

export function mapGroupeStatEffectifsToDTO(rows: GroupeStatEffectifRow[]): GroupeStatEffectifsDTO {
    return {
        items: rows.map((row) => ({
            label: row.groupe_label ?? row.groupe_code,
            value: row.nb_acteurs,
        })),
    };
}

export function mapGroupeStatCohesionToDTO(rows: GroupeStatCohesionPointEntity[]): GroupeStatCohesionDTO {
    return {
        points: rows.map((row) => ({
            label: row.mois.toISOString().slice(0, 7),
            value: row.taux_cohesion ?? 0,
        })),
    };
}

/**
 * Une série par groupe, un item "Pour"/"Contre"/"Abstention" par série —
 * ordre des groupes préservé (déjà trié par le repository). Le nom de série
 * est le CODE court du groupe (ex: "RN"), pas le libellé complet (ex:
 * "Rassemblement National") — trop long pour tenir sur l'axe d'un
 * stacked-bar avec un groupe par barre.
 */
export function mapGroupeStatPositionsVoteToDTO(rows: GroupeStatPositionVoteRow[]): GroupeStatPositionsVoteDTO {
    const byGroupe = new Map<string, { name: string; items: { label: string; value: number }[] }>();

    for (const row of rows) {
        if (!byGroupe.has(row.groupe_code)) {
            byGroupe.set(row.groupe_code, { name: row.groupe_code, items: [] });
        }
        const label = POSITION_LABELS[row.position] ?? row.position;
        byGroupe.get(row.groupe_code)!.items.push({ label, value: row.pourcentage });
    }

    return { series: Array.from(byGroupe.values()) };
}

/** Un item par groupe, label = CODE (pas le libellé complet) — même convention que `mapGroupeStatPositionsVoteToDTO`. Ordre préservé (déjà trié par le repository). */
export function mapGroupeStatExpressionVotesToDTO(rows: GroupeStatExpressionVoteRow[]): GroupeStatExpressionVotesDTO {
    return {
        items: rows.map((row) => ({
            label: row.groupe_code,
            value: row.taux_expression_votes ?? 0,
        })),
    };
}
