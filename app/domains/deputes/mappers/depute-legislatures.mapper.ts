import { DeputeLegislatureEntity } from "@/app/domains/deputes/entities/depute-legislatures.entity";
import { DeputeLegislaturesDTO } from "@/app/domains/deputes/dto/depute-legislatures.dto";

export function mapEntitiesToDeputeLegislaturesDTO(entities: DeputeLegislatureEntity[]): DeputeLegislaturesDTO {
    return entities.map(entity => entity.legislature);
}
