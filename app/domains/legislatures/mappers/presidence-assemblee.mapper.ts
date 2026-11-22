import { PresidenceAssembleeEntity } from "@/app/domains/legislatures/entities/presidence-assemblee.entity";
import { PresidenceAssembleeDTO } from "@/app/domains/legislatures/dto/presidence-assemblee.dto";

export function mapPresidenceAssembleeToDTO(entity: PresidenceAssembleeEntity): PresidenceAssembleeDTO {
    return {
        uid: entity.acteur_uid,
        nom: `${entity.prenom} ${entity.nom}`,
        depuis: entity.debut,
        jusqua: entity.fin,
    };
}
