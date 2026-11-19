import { anAmendementUrl, anDossierUrl, anScrutinUrl } from "@/app/_shared/utils/assemblee-nationale";

/** Colonnes de lien qu'ajoutent les repositories d'activité (député et groupe). */
export type ActivityDetailLinkColumns = {
    scrutin_numero: string | null;
    dossier_uid: string | null;
    dossier_titre: string | null;
    dossier_legislature: number | null;
};

export type ActivityDossierRefDTO = {
    uid: string;
    titre: string;
    lienAN: string;
};

export type ActivityDetailLinksDTO = {
    /** Page de l'objet lui-même (amendement ou scrutin) sur le site de l'AN. */
    lienAN: string | null;
    /** Dossier législatif de l'objet, quand il est connu. */
    dossier: ActivityDossierRefDTO | null;
};

const AMENDEMENT_DOMAINS = new Set(["amendement", "amendement_co"]);
const SCRUTIN_DOMAINS = new Set(["vote", "scrutin"]);

function objectLink(domain: string, refId: string, scrutinNumero: string | null, legislature: number): string | null {
    if (AMENDEMENT_DOMAINS.has(domain)) return anAmendementUrl(legislature, refId);
    if (SCRUTIN_DOMAINS.has(domain) && scrutinNumero) return anScrutinUrl(legislature, scrutinNumero);
    return null;
}

export function activityDetailLinks(
    entity: ActivityDetailLinkColumns & { domain: string; ref_id: string },
    legislature: number
): ActivityDetailLinksDTO {
    const { dossier_uid, dossier_titre, dossier_legislature } = entity;
    return {
        lienAN: objectLink(entity.domain, entity.ref_id, entity.scrutin_numero, legislature),
        dossier: dossier_uid && dossier_titre
            ? {
                uid: dossier_uid,
                titre: dossier_titre,
                lienAN: anDossierUrl(dossier_legislature ?? legislature, dossier_uid),
            }
            : null,
    };
}
