import {GroupeActivityEntity} from "@/app/domains/groupes/entities/groupe-activity.entity";
import {GroupeActivityDTO} from "@/app/domains/groupes/dto/groupe-activity.dto";

function toLevel(count: number): number {
    if (count === 0) return 0;
    if (count <= 20) return 1;
    if (count <= 100) return 2;
    if (count <= 200) return 3;
    return 4;
}

export function mapEntityToGroupeActivityDTO(
    entities: GroupeActivityEntity[]
): GroupeActivityDTO {

    if (!entities || entities.length === 0) return [];

    return entities.map((e) => {
        const count = Number(e.total_count ?? 0);

        return {
            date: e.activity_date.toISOString().split("T")[0],
            count,
            level: toLevel(count),
        };
    });
}