import {GroupeActivityDetailsDTO} from "@/app/domains/groupes/dto/groupe-activity-details.dto";
import {GroupeActivityDetailsEntity} from "@/app/domains/groupes/entities/groupe-activity-details.entity";

export function mapEntityToGroupeActivityDetailsDTO(
    entities: GroupeActivityDetailsEntity[]
): GroupeActivityDetailsDTO[] {
    return entities.map(e => ({
        date: e.activity_date.toISOString().split('T')[0],
        domain: e.domain as any,
        refId: e.ref_id,
        meta: e.meta
    }));
}