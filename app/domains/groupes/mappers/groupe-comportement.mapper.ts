import {GroupeComportementEntity} from "@/app/domains/groupes/entities/groupe-comportement.entity";
import {GroupeComportementDTO} from "@/app/domains/groupes/dto/groupe-comportement.dto";

export function mapEntityToGroupeComportementDTO(entity: GroupeComportementEntity): GroupeComportementDTO {
    return {
        evolutionParticipationLegislature: entity.participationLegislature.map((row) => ({
            key: row.mois.toISOString().slice(0, 7),
            value: row.taux_participation_moyen_deputes ?? 0,
        })),
    };
}