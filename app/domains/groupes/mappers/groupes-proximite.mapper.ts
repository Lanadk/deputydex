import { GroupeProximitePaireRow } from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";
import {
    GroupeProximiteGouvernementDTO,
    GroupeProximitePaireDTO,
    GroupesProximiteDTO,
} from "@/app/domains/groupes/dto/groupes-proximite.dto";

/**
 * Même principe que `groupes-age.mapper.ts` : trie par la métrique et
 * calcule les extrêmes une seule fois, pour ne pas dupliquer cette logique
 * côté UI. Une paire sans taux (NULL côté vue = aucun scrutin commun) est
 * écartée plutôt que ramenée à 0 — sinon elle passerait pour "la paire la
 * plus éloignée".
 *
 * `gouvernementReferenceCode` : la vue liste chaque paire une seule fois
 * (A < B), le groupe de référence peut donc être côté A ou côté B — on
 * renvoie toujours "l'autre" groupe de la paire.
 */
export function mapEntitiesToGroupesProximiteDTO(
    rows: GroupeProximitePaireRow[],
    gouvernementReferenceCode: string | null
): GroupesProximiteDTO {
    const paires: GroupeProximitePaireDTO[] = rows
        .filter((row) => row.taux_proximite != null)
        .map((row) => ({
            groupeACode: row.groupe_a_code,
            groupeALabel: row.groupe_a_label ?? row.groupe_a_code,
            groupeBCode: row.groupe_b_code,
            groupeBLabel: row.groupe_b_label ?? row.groupe_b_code,
            tauxProximite: Math.round(row.taux_proximite! * 1000) / 10,
            nbScrutinsCommuns: row.nb_scrutins_communs,
        }))
        .sort((a, b) => b.tauxProximite - a.tauxProximite);

    let gouvernementReference: GroupesProximiteDTO["gouvernementReference"] = null;
    const proximiteGouvernement: GroupeProximiteGouvernementDTO[] = [];

    if (gouvernementReferenceCode) {
        let referenceLabel = gouvernementReferenceCode;
        for (const p of paires) {
            if (p.groupeACode === gouvernementReferenceCode) {
                referenceLabel = p.groupeALabel;
                proximiteGouvernement.push({ groupeCode: p.groupeBCode, groupeLabel: p.groupeBLabel, tauxProximite: p.tauxProximite, nbScrutinsCommuns: p.nbScrutinsCommuns });
            } else if (p.groupeBCode === gouvernementReferenceCode) {
                referenceLabel = p.groupeBLabel;
                proximiteGouvernement.push({ groupeCode: p.groupeACode, groupeLabel: p.groupeALabel, tauxProximite: p.tauxProximite, nbScrutinsCommuns: p.nbScrutinsCommuns });
            }
        }
        gouvernementReference = { code: gouvernementReferenceCode, label: referenceLabel };
    }

    return {
        paires,
        plusProches: paires[0] ?? null,
        plusEloignes: paires.length > 0 ? paires[paires.length - 1] : null,
        gouvernementReference,
        proximiteGouvernement,
    };
}
