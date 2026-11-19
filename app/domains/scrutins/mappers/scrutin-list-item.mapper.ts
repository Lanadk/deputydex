import { ScrutinListItemEntity } from "@/app/domains/scrutins/entities/scrutin-list-item.entity";
import { ScrutinListItemDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { RESULTAT_SCRUTIN_ADOPTE, resultatLibelle } from "@/app/domains/scrutins/mappers/scrutin-detail.mapper";
import { scrutinObjetLabel, scrutinTypeLabel } from "@/app/domains/scrutins/scrutin-labels";

export function mapScrutinListItemEntityToDTO(entity: ScrutinListItemEntity): ScrutinListItemDTO {
    return {
        uid: entity.uid,
        numero: entity.numero,
        date: entity.date_scrutin?.toISOString() ?? null,
        titre: entity.titre,
        type: { code: entity.type_scrutin_code, libelle: scrutinTypeLabel(entity.type_scrutin_code) },
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
