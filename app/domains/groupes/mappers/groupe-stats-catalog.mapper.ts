import {
    GroupeStatCohesionPointEntity,
    GroupeStatEffectifRow,
    GroupeStatPariteEntity,
} from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";
import {
    GroupeStatCohesionDTO,
    GroupeStatEffectifsDTO,
    GroupeStatPariteDTO,
} from "@/app/domains/groupes/dto/groupe-stats-catalog.dto";

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
