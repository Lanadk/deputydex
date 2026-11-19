import { DeputeDossierContributionEntity } from "@/app/domains/deputes/entities/depute-dossier-contribution.entity";
import { DeputeDossierContributionDTO } from "@/app/domains/deputes/dto/depute-dossier-contribution.dto";
import { etapeLabel } from "@/app/domains/dossiers/etape-label";
import { anDossierUrl } from "@/app/_shared/utils/assemblee-nationale";

export function mapDeputeDossierContributionEntityToDTO(entity: DeputeDossierContributionEntity): DeputeDossierContributionDTO {
    return {
        dossierUid: entity.dossier_uid,
        titre: entity.dossier_titre,
        procedure: entity.procedure_libelle,
        nbDeposes: Number(entity.nb_deposes),
        nbAdoptes: Number(entity.nb_adoptes),
        nbCosignes: Number(entity.nb_cosignes),
        isAuteurTexte: entity.is_auteur_texte,
        isCosignataireTexte: entity.is_cosignataire_texte,
        rapporteurs: (entity.rapporteurs ?? []).map((r) => ({ type: r.type, etape: etapeLabel(r.etape) })),
        derniereActivite: entity.derniere_activite?.toISOString() ?? null,
        lienAN: anDossierUrl(entity.dossier_legislature, entity.dossier_uid),
    };
}

export function mapDeputeDossierContributionsEntitiesToDTOs(entities: DeputeDossierContributionEntity[]): DeputeDossierContributionDTO[] {
    return entities.map(mapDeputeDossierContributionEntityToDTO);
}
