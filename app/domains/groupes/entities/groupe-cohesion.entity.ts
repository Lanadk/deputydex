import {
    EvolutionCohesionLegislatureRow,
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-cohesion.repository";

export type GroupeCohesionEntity = {
    evolutionCohesionLegislature: EvolutionCohesionLegislatureRow[]
}