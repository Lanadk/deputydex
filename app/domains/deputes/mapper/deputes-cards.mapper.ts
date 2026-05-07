import {DeputesCardDTO} from "@/app/domains/deputes/dto/deputes-card.dto";
import {DeputesCardEntity} from "@/app/domains/deputes/entities/deputes-cards.entity";

export function mapDeputesCardToDTO(a: DeputesCardEntity): DeputesCardDTO {
    return {
        deputeUID: a.depute_uid,
        deputeFullName: a.depute_full_name ?? '',
        deputeGroupeCode: a.depute_groupe_code ?? '',
        deputeImage: a.depute_image ?? '/tribun/16/photos_deputes_nobg/261_Jérôme_Guedj.png',
        deputeRole: a.depute_role ?? undefined,
    };
}

export function mapDeputesCardsToDTOs(list: DeputesCardEntity[]): DeputesCardDTO[] {
    return list.map(mapDeputesCardToDTO);
}