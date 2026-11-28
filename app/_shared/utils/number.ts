/**
 * Nombre à la française (virgule décimale, espace des milliers), entre `min`
 * et `max` décimales — ex. `formatNombreFr(57, { min: 1, max: 1 })` → « 57,0 ».
 */
export function formatNombreFr(valeur: number, { min = 0, max }: { min?: number; max: number }): string {
    return valeur.toLocaleString("fr-FR", { minimumFractionDigits: min, maximumFractionDigits: max });
}
