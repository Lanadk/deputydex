import { GenderDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-gender-distribution.entity";
import { ActeurGenderDistributionDTO } from "@/app/domains/acteurs/dto/acteur-gender-distribution.dto";

const CIVILITE_LABELS: Record<string, string> = {
    "M.": "Hommes",
    "Mme": "Femmes",
};

export function mapActeurGenderDistributionToDTO(entities: GenderDistributionBucketEntity[]): ActeurGenderDistributionDTO {
    return {
        items: entities.map((entity) => ({
            label: CIVILITE_LABELS[entity.civilite] ?? entity.civilite,
            value: entity.nb_acteurs,
        })),
    };
}
