import { DeputeDossierAmendementEntity } from "@/app/domains/deputes/entities/depute-dossier-amendement.entity";
import { DeputeDossierAmendementDTO } from "@/app/domains/deputes/dto/depute-dossier-amendement.dto";
import { htmlToPlainText } from "@/app/_shared/utils/string";

export function mapDeputeDossierAmendementEntityToDTO(entity: DeputeDossierAmendementEntity): DeputeDossierAmendementDTO {
    const expose = entity.expose_sommaire ? htmlToPlainText(entity.expose_sommaire) : "";
    return {
        uid: entity.uid,
        numero: entity.numero_long,
        division: entity.division_titre,
        statut: entity.sort || entity.etat_libelle || null,
        isAdopte: entity.sort === "Adopté",
        dateDepot: entity.date_depot?.toISOString() ?? null,
        exposeSommaire: expose || null,
        lienAN: `https://www.assemblee-nationale.fr/dyn/${entity.legislature_snapshot}/amendements/${entity.uid}`,
    };
}

export function mapDeputeDossierAmendementsEntitiesToDTOs(entities: DeputeDossierAmendementEntity[]): DeputeDossierAmendementDTO[] {
    return entities.map(mapDeputeDossierAmendementEntityToDTO);
}
