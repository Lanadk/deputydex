import { AgeDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-age-distribution.entity";
import { ActeurAgeDistributionDTO } from "@/app/domains/acteurs/dto/acteur-age-distribution.dto";

export function mapActeurAgeDistributionToDTO(entities: AgeDistributionBucketEntity[]): ActeurAgeDistributionDTO {
    return {
        items: entities.map((entity) => ({
            label: entity.tranche_age,
            value: entity.nb_acteurs,
        })),
    };
}
