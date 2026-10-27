/**
 * Groupes renommés en cours de législature, ancien code → code actuel — ce
 * sont "en gros le même groupe" (mêmes membres, nouveau nom/nouvel organe
 * côté Assemblée), donc à additionner quand une stat porte sur toute la
 * législature. Le code ACTUEL sert de code canonique : c'est lui qui a encore
 * des membres et une carte (`getGroupesCards`).
 *
 * Dates constatées dans `acteurs_groupes` :
 * - 16ᵉ : SOC-NUPES (→ 2023-10-17) puis SOC (2023-10-18 →)
 * - 17ᵉ : UDR (2024-09-11 → 2025-09-03) puis UDDPLR (2025-09-04 →)
 */
const GROUPE_LINEAGE_BY_LEGISLATURE: Record<number, Record<string, string>> = {
    16: { "SOC-NUPES": "SOC" },
    17: { UDR: "UDDPLR" },
};

export function getGroupeLineage(legislature: number): Record<string, string> {
    return GROUPE_LINEAGE_BY_LEGISLATURE[legislature] ?? {};
}
