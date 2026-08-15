import { DeputeActivityEntity } from "@/app/domains/deputes/entities/depute-activity.entity";
import { DeputeActivityDTO } from "@/app/domains/deputes/dto/depute-activity.dto";

function toLevel(count: number): number {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 8) return 2;
    if (count <= 20) return 3;
    return 4;
}

export function mapEntityToDeputeActivityDTO(
    entities: DeputeActivityEntity[]
): DeputeActivityDTO {
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
