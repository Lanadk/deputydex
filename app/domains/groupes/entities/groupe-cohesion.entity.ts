import {
    CohesionLegislatureRow,
    CouvertureScrutinsRow,
    EvolutionCohesionLegislatureRow,
    ParticipationLegislatureRow,
    ProximiteGouvernementRow,
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-cohesion.repository";

export type GroupeCohesionEntity = {
    evolutionCohesionLegislature: EvolutionCohesionLegislatureRow[]
    cohesionLegislature: CohesionLegislatureRow | null
    couvertureScrutins: CouvertureScrutinsRow | null
    participationLegislature: ParticipationLegislatureRow | null
    proximiteGouvernement: ProximiteGouvernementRow | null
}