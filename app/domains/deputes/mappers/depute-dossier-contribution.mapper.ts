import { DeputeDossierContributionEntity } from "@/app/domains/deputes/entities/depute-dossier-contribution.entity";
import { DeputeDossierContributionDTO } from "@/app/domains/deputes/dto/depute-dossier-contribution.dto";

export function mapDeputeDossierContributionEntityToDTO(entity: DeputeDossierContributionEntity): DeputeDossierContributionDTO {
    return {
        dossierUid: entity.dossier_uid,
        titre: entity.dossier_titre,
        procedure: entity.procedure_libelle,
        nbDeposes: Number(entity.nb_deposes),
        nbAdoptes: Number(entity.nb_adoptes),
        nbCosignes: Number(entity.nb_cosignes),
        isInitiateur: entity.is_initiateur,
        rolesRapporteur: entity.roles_rapporteur ?? [],
        derniereActivite: entity.derniere_activite?.toISOString() ?? null,
        lienAN: `https://www.assemblee-nationale.fr/dyn/${entity.dossier_legislature}/dossiers/${entity.dossier_uid}`,
    };
}

export function mapDeputeDossierContributionsEntitiesToDTOs(entities: DeputeDossierContributionEntity[]): DeputeDossierContributionDTO[] {
    return entities.map(mapDeputeDossierContributionEntityToDTO);
}
