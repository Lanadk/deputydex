import { DeputeListItemEntity } from "@/app/domains/deputes/entities/depute-list-item.entity";
import { DeputeListItemDTO } from "@/app/domains/deputes/dto/depute-list-item.dto";

export function mapDeputeListItemEntityToDTO(entity: DeputeListItemEntity): DeputeListItemDTO {
    return {
        uid: entity.uid,
        prenom: entity.prenom,
        nom: entity.nom,
        groupeCode: entity.groupe_code,
        groupeLabel: entity.groupe_label,
        photoPath: entity.photo_path,
    };
}
