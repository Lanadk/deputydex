import { DeputeDossierAmendementEntity } from "@/app/domains/deputes/entities/depute-dossier-amendement.entity";
import { DeputeDossierAmendementDTO } from "@/app/domains/deputes/dto/depute-dossier-amendement.dto";
import { etapeLabel } from "@/app/domains/dossiers/etape-label";
import { htmlToPlainText } from "@/app/_shared/utils/string";
import { anAmendementUrl } from "@/app/_shared/utils/assemblee-nationale";

/** Valeur de `amendements.sort` pour un amendement adopté (open data AN). */
export const SORT_AMENDEMENT_ADOPTE = "Adopté";

/**
 * Dans les identifiants AN, "BTC" marque le texte adopté par la commission
 * (ex. PIONANR5L17BTC0475), que l'open data ne rattache pas toujours à une étape.
 */
function isTexteCommission(texteUid: string): boolean {
    return /BTC\d+$/.test(texteUid);
}

function texteLibelle(entity: DeputeDossierAmendementEntity): string {
    const nom = entity.texte_type
        ? `${entity.texte_type}${entity.texte_numero ? ` n° ${entity.texte_numero}` : ""}`
        : "Texte";
    const etape = entity.texte_etape
        ? etapeLabel(entity.texte_etape)
        : isTexteCommission(entity.texte_uid) ? "texte de la commission" : null;
    return etape ? `${nom} · ${etape}` : nom;
}

export function mapDeputeDossierAmendementEntityToDTO(entity: DeputeDossierAmendementEntity): DeputeDossierAmendementDTO {
    const expose = entity.expose_sommaire ? htmlToPlainText(entity.expose_sommaire) : "";
    return {
        uid: entity.uid,
        numero: entity.numero_long,
        division: entity.division_titre,
        statut: entity.sort || entity.etat_libelle || null,
        isAdopte: entity.sort === SORT_AMENDEMENT_ADOPTE,
        dateDepot: entity.date_depot?.toISOString() ?? null,
        exposeSommaire: expose || null,
        lienAN: anAmendementUrl(entity.legislature_snapshot, entity.uid),
        texte: {
            uid: entity.texte_uid,
            libelle: texteLibelle(entity),
        },
    };
}

export function mapDeputeDossierAmendementsEntitiesToDTOs(entities: DeputeDossierAmendementEntity[]): DeputeDossierAmendementDTO[] {
    return entities.map(mapDeputeDossierAmendementEntityToDTO);
}
