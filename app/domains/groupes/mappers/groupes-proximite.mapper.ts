import { GroupeProximitePaireRow } from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";
import {
    GroupeProximiteGouvernementDTO,
    GroupeProximitePaireDTO,
    GroupesProximiteDTO,
} from "@/app/domains/groupes/dto/groupes-proximite.dto";

/**
 * Additionne les paires d'un même groupe renommé en cours de législature
 * (`lineage` : ancien code → code actuel, voir `groupe-lineage.constants.ts`)
 * — ex: (UDR, RN) + (UDDPLR, RN) → (UDDPLR, RN). On somme les COMPTAGES
 * (scrutins alignés / scrutins comparés) puis on recalcule le taux : c'est la
 * moyenne pondérée correcte, pas la moyenne des deux taux. Une paire dont les
 * deux côtés se ramènent au même groupe (ex: UDR, UDDPLR) n'a pas de sens et
 * est écartée.
 */
function mergeLineage(rows: GroupeProximitePaireRow[], lineage: Record<string, string>) {
    const canonical = (code: string) => lineage[code] ?? code;

    // Libellé d'un code canonique = celui porté par le code actuel lui-même
    // (ex: "Socialistes et apparentés" plutôt que "... - NUPES").
    const labels = new Map<string, string>();
    const remember = (code: string, label: string | null) => {
        if (canonical(code) === code && label) labels.set(code, label);
        else if (!labels.has(canonical(code)) && label) labels.set(canonical(code), label);
    };

    const merged = new Map<string, { a: string; b: string; communs: number; alignes: number }>();
    for (const row of rows) {
        remember(row.groupe_a_code, row.groupe_a_label);
        remember(row.groupe_b_code, row.groupe_b_label);

        const a = canonical(row.groupe_a_code);
        const b = canonical(row.groupe_b_code);
        if (a === b) continue;

        const [first, second] = a < b ? [a, b] : [b, a];
        const key = `${first}|${second}`;
        const acc = merged.get(key) ?? { a: first, b: second, communs: 0, alignes: 0 };
        acc.communs += row.nb_scrutins_communs;
        acc.alignes += row.nb_scrutins_alignes;
        merged.set(key, acc);
    }

    return { merged: Array.from(merged.values()), labelOf: (code: string) => labels.get(code) ?? code, canonical };
}

/**
 * Même principe que `groupes-age.mapper.ts` : trie par la métrique et
 * calcule les extrêmes une seule fois, pour ne pas dupliquer cette logique
 * côté UI. Une paire sans scrutin commun est écartée plutôt que ramenée à
 * 0% — sinon elle passerait pour "la paire la plus éloignée".
 *
 * `gouvernementReferenceCode` : chaque paire n'apparaît qu'une fois, le
 * groupe de référence peut donc être côté A ou côté B — on renvoie toujours
 * "l'autre" groupe de la paire.
 */
export function mapEntitiesToGroupesProximiteDTO(
    rows: GroupeProximitePaireRow[],
    gouvernementReferenceCode: string | null,
    lineage: Record<string, string> = {}
): GroupesProximiteDTO {
    const { merged, labelOf, canonical } = mergeLineage(rows, lineage);

    const paires: GroupeProximitePaireDTO[] = merged
        .filter((p) => p.communs > 0)
        .map((p) => ({
            groupeACode: p.a,
            groupeALabel: labelOf(p.a),
            groupeBCode: p.b,
            groupeBLabel: labelOf(p.b),
            tauxProximite: Math.round((p.alignes / p.communs) * 1000) / 10,
            nbScrutinsCommuns: p.communs,
        }))
        .sort((a, b) => b.tauxProximite - a.tauxProximite);

    let gouvernementReference: GroupesProximiteDTO["gouvernementReference"] = null;
    const proximiteGouvernement: GroupeProximiteGouvernementDTO[] = [];

    if (gouvernementReferenceCode) {
        const ref = canonical(gouvernementReferenceCode);
        for (const p of paires) {
            if (p.groupeACode === ref) {
                proximiteGouvernement.push({ groupeCode: p.groupeBCode, groupeLabel: p.groupeBLabel, tauxProximite: p.tauxProximite, nbScrutinsCommuns: p.nbScrutinsCommuns });
            } else if (p.groupeBCode === ref) {
                proximiteGouvernement.push({ groupeCode: p.groupeACode, groupeLabel: p.groupeALabel, tauxProximite: p.tauxProximite, nbScrutinsCommuns: p.nbScrutinsCommuns });
            }
        }
        gouvernementReference = { code: ref, label: labelOf(ref) };
    }

    return {
        paires,
        plusProches: paires[0] ?? null,
        plusEloignes: paires.length > 0 ? paires[paires.length - 1] : null,
        gouvernementReference,
        proximiteGouvernement,
    };
}
