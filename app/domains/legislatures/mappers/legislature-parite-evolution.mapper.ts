import { LegislaturePariteRow } from "@/app/domains/legislatures/entities/legislature-parite-evolution.entity";
import { LegislaturePariteEvolutionDTO } from "@/app/domains/legislatures/dto/legislature-parite-evolution.dto";

export function mapLegislaturePariteEvolutionToDTO(rows: LegislaturePariteRow[]): LegislaturePariteEvolutionDTO {
    return {
        points: rows.map((row) => {
            const total = row.nb_hommes + row.nb_femmes;
            const pctFemmes = total > 0 ? Math.round((row.nb_femmes / total) * 1000) / 10 : 0;
            return { label: `${row.legislature}ᵉ`, value: pctFemmes };
        }),
    };
}
