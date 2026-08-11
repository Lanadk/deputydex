import {GroupeCohesionDTO} from "@/app/domains/groupes/dto/groupe-cohesion.dto";
import {GroupeCohesionEntity} from "@/app/domains/groupes/entities/groupe-cohesion.entity";

export function mapEntityToGroupeCohesionDTO(entity: GroupeCohesionEntity): GroupeCohesionDTO {
    return {
        evolutionCohesionLegislature: entity.evolutionCohesionLegislature.map((row) => ({
            key: row.mois.toISOString().slice(0, 7),
            value: row.taux_cohesion ?? 0,
        })),
        tauxCohesionLegislature: entity.cohesionLegislature?.taux_cohesion != null
            ? Math.round(entity.cohesionLegislature.taux_cohesion * 100)
            : null,
        nbScrutinsCouverts: entity.couvertureScrutins?.nb_scrutins_couverts ?? null,
        tauxParticipationLegislature: entity.participationLegislature?.taux_participation_legislature ?? null,
        tauxProximiteGouvernement: entity.proximiteGouvernement?.taux_proximite != null
            ? Math.round(entity.proximiteGouvernement.taux_proximite * 100)
            : null,
    };
}