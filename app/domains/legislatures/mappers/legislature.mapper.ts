import {LegislatureDTO} from "@/app/domains/legislatures/dto/legislature.dto";
import {LegislatureEntity} from "@/app/domains/legislatures/entities/legislature.entity";


export function mapLegislatureToDTO(entity: LegislatureEntity): LegislatureDTO {
    return {
        id: entity.id,
        number: entity.number,
        startDate: entity.startDate?.toISOString() ?? null,
        endDate: entity.endDate?.toISOString() ?? null,
    };
}

export function mapLegislaturesToDTO(list: LegislatureEntity[]): LegislatureDTO[] {
    return list.map(mapLegislatureToDTO);
}