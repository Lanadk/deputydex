import {GroupeCohesionDTO} from "@/app/domains/groupes/dto/groupe-cohesion.dto";
import {GroupeCohesionRow} from "@/app/infrastructure/groupes/repositories/prisma-groupe-cohesion.repository";

export function mapEntityToGroupeCohesionDTO(entities: GroupeCohesionRow[]): GroupeCohesionDTO {
    return {
        evolutionCohesion: entities.map((row) => ({
            key: row.mois.toISOString().slice(0, 7), // "YYYY-MM"
            value: row.taux_cohesion ?? 0,
        })),
    };
}