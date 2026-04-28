import { DeputeIdentityEntity } from "@/app/domains/deputes/entities/depute-identity.entity";
import { DeputeIdentityDTO } from "@/app/domains/deputes/dto/depute-identity.dto";

function computeAge(dateNaissance: Date | null): number | null {
    if (!dateNaissance) return null;
    const today = new Date();
    let age = today.getFullYear() - dateNaissance.getFullYear();
    const m = today.getMonth() - dateNaissance.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateNaissance.getDate())) age--;
    return age;
}

export function mapDeputeIdentityEntityToDTO(
    entity: DeputeIdentityEntity,
    legislature: number
): DeputeIdentityDTO {
    return {
        uid: entity.uid,
        prenom: entity.prenom,
        nom: entity.nom,
        civilite: entity.civilite,
        dateNaissance: entity.date_naissance?.toISOString() ?? null,
        age: computeAge(entity.date_naissance),
        professionLibelle: entity.profession_libelle,
        professionCategorie: entity.profession_categorie,
        professionFamille: entity.profession_famille,
        photoUrl: entity.photo_path,
        groupeCode: entity.groupe_code,
        groupeLabel: entity.groupe_label,
        region: entity.region,
        departement: entity.departement,
        numCirco: entity.num_circo,
        legislature,
        lienAN: `https://www.assemblee-nationale.fr/dyn/deputes/${entity.uid}`,
    };
}
