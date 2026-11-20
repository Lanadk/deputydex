import { ScrutinListItemEntity } from "@/app/domains/scrutins/entities/scrutin-list-item.entity";
import { ScrutinListItemDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { RESULTAT_SCRUTIN_ADOPTE, resultatLibelle, scrutinObjetLabel } from "@/app/domains/scrutins/scrutin-labels";

export function mapScrutinListItemEntityToDTO(entity: ScrutinListItemEntity): ScrutinListItemDTO {
    return {
        uid: entity.uid,
        numero: entity.numero,
        date: entity.date_scrutin?.toISOString() ?? null,
        titre: entity.titre,
        // Libellé brut de l'open data, comme sur la fiche scrutin (ex. "scrutin public solennel")
        type: { code: entity.type_scrutin_code, libelle: entity.type_scrutin_libelle },
        resultat: {
            isAdopte: entity.resultat_code === RESULTAT_SCRUTIN_ADOPTE,
            libelle: resultatLibelle(entity.resultat_code),
        },
        objet: { code: entity.objet, libelle: scrutinObjetLabel(entity.objet) },
        pour: entity.total_pour,
        contre: entity.total_contre,
        abstentions: entity.total_abstentions,
    };
}

export function mapScrutinListItemsEntitiesToDTOs(entities: ScrutinListItemEntity[]): ScrutinListItemDTO[] {
    return entities.map(mapScrutinListItemEntityToDTO);
}
