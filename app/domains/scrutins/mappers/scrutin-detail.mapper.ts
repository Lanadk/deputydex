import { ScrutinDetailEntity } from "@/app/domains/scrutins/entities/scrutin-detail.entity";
import { ScrutinDetailDTO } from "@/app/domains/scrutins/dto/scrutin-detail.dto";
import { anScrutinUrl } from "@/app/_shared/utils/assemblee-nationale";
import { RESULTAT_SCRUTIN_ADOPTE, resultatLibelle } from "@/app/domains/scrutins/scrutin-labels";

export function mapScrutinDetailEntityToDTO(entity: ScrutinDetailEntity): ScrutinDetailDTO {
    return {
        uid: entity.uid,
        numero: entity.numero,
        legislature: entity.legislature,
        titre: entity.titre,
        date: entity.date_scrutin?.toISOString() ?? null,
        type: {
            code: entity.type_scrutin_code,
            libelle: entity.type_scrutin_libelle,
        },
        typeMajorite: entity.type_majorite,
        resultat: {
            isAdopte: entity.resultat_code === RESULTAT_SCRUTIN_ADOPTE,
            libelle: resultatLibelle(entity.resultat_code),
        },
        totaux: {
            votants: entity.nombre_votants,
            exprimes: entity.suffrages_exprimes,
            requis: entity.suffrages_requis,
            pour: entity.total_pour,
            contre: entity.total_contre,
            abstentions: entity.total_abstentions,
            nonVotants: entity.total_non_votants,
        },
        lienAN: entity.numero ? anScrutinUrl(entity.legislature, entity.numero) : null,
    };
}
