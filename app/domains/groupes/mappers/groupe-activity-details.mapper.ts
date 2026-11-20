import {GroupeActivityDetailsDTO} from "@/app/domains/groupes/dto/groupe-activity-details.dto";
import {GroupeActivityDetailsEntity} from "@/app/domains/groupes/entities/groupe-activity-details.entity";
import {activityDetailLinks} from "@/app/domains/activity/activity-detail-links";

export function mapEntityToGroupeActivityDetailsDTO(
    entities: GroupeActivityDetailsEntity[],
    legislature: number
): GroupeActivityDetailsDTO[] {
    return entities.map(e => ({
        date: e.activity_date.toISOString().split('T')[0],
        domain: e.domain as GroupeActivityDetailsDTO["domain"],
        refId: e.ref_id,
        meta: e.meta,
        ...activityDetailLinks(e, legislature),
    }));
}
