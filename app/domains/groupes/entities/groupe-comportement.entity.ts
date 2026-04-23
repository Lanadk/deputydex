import {
    GroupeParticipationLegislatureRow
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-comportement.repository";

export type GroupeComportementEntity = {
    participationLegislature: GroupeParticipationLegislatureRow[];
}