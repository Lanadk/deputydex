import { ProfessionDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-profession-distribution.entity";
import { ProfessionFamilleDistributionBucketEntity } from "@/app/domains/acteurs/entities/acteur-profession-famille-distribution.entity";
import { ActeurProfessionDistributionDTO } from "@/app/domains/acteurs/dto/acteur-profession-distribution.dto";

export function mapActeurProfessionDistributionToDTO(entities: ProfessionDistributionBucketEntity[]): ActeurProfessionDistributionDTO {
    return {
        items: entities.map((entity) => ({
            label: entity.profession_categorie,
            value: entity.nb_acteurs,
        })),
    };
}

/** Même forme que `mapActeurProfessionDistributionToDTO` — `ActeurProfessionDistributionDTO` est structurel (label/value), réutilisé tel quel pour la granularité "famille". */
export function mapActeurProfessionFamilleDistributionToDTO(entities: ProfessionFamilleDistributionBucketEntity[]): ActeurProfessionDistributionDTO {
    return {
        items: entities.map((entity) => ({
            label: entity.profession_famille,
            value: entity.nb_acteurs,
        })),
    };
}
