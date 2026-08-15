import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { DeputesCardEntity } from "@/app/domains/deputes/entities/deputes-cards.entity";

export function mapDeputesCardToDTO(entity: DeputesCardEntity): DeputesCardDTO {
    return {
        deputeUID: entity.depute_uid,
        deputeFullName: entity.depute_full_name ?? "",
        deputeGroupeCode: entity.depute_groupe_code ?? "",
        deputeImage: entity.depute_image ?? "",
        deputeRole: entity.depute_role ?? undefined,
    };
}

export function mapDeputesCardsToDTOs(entities: DeputesCardEntity[]): DeputesCardDTO[] {
    return entities.map(mapDeputesCardToDTO);
}
