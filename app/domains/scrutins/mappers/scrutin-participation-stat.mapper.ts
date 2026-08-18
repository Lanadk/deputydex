import { ScrutinParticipationPointEntity } from "@/app/domains/scrutins/entities/scrutin-participation-evolution.entity";
import { ScrutinParticipationStatDTO } from "@/app/domains/scrutins/dto/scrutin-participation-stat.dto";

export function mapScrutinParticipationStatToDTO(rows: ScrutinParticipationPointEntity[]): ScrutinParticipationStatDTO {
    return {
        points: rows.map((row) => ({
            label: row.mois,
            value: row.taux_participation != null ? Math.round(row.taux_participation * 10) / 10 : 0,
        })),
    };
}
