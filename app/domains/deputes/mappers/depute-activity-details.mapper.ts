import { DeputeActivityDetailsDTO } from "@/app/domains/deputes/dto/depute-activity-details.dto";
import { DeputeActivityDetailsEntity } from "@/app/domains/deputes/entities/depute-activity-details.entity";
import { activityDetailLinks } from "@/app/domains/activity/activity-detail-links";

export function mapEntityToDeputeActivityDetailsDTO(
    entities: DeputeActivityDetailsEntity[],
    legislature: number
): DeputeActivityDetailsDTO[] {
    return entities.map((e) => ({
        date: e.activity_date.toISOString().split("T")[0],
        domain: e.domain as DeputeActivityDetailsDTO["domain"],
        refId: e.ref_id,
        meta: e.meta,
        ...activityDetailLinks(e, legislature),
    }));
}
