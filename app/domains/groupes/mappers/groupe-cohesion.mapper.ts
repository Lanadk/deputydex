import {GroupeCohesionDTO} from "@/app/domains/groupes/dto/groupe-cohesion.dto";
import {GroupeCohesionEntity} from "@/app/domains/groupes/entities/groupe-cohesion.entity";

export function mapEntityToGroupeCohesionDTO(entity: GroupeCohesionEntity): GroupeCohesionDTO {
    return {
        evolutionCohesionLegislature: entity.evolutionCohesionLegislature.map((row) => ({
            key: row.mois.toISOString().slice(0, 7),
            value: row.taux_cohesion ?? 0,
        })),
    };
}