import {GroupeLegislatureEntity} from "@/app/domains/groupes/entities/groupe-legislatures.entity";
import {GroupeLegislaturesDTO} from "@/app/domains/groupes/dto/groupe-legislatures.dto";

export function mapEntitiesToGroupeLegislaturesDTO(entities: GroupeLegislatureEntity[]): GroupeLegislaturesDTO {
    return entities.map(entity => entity.legislature);
}
