import { err, ok, Result } from "@/app/_shared/result-pattern/result";

/**
 * Lit un numéro de législature venu d'une URL : un entier strictement positif
 * écrit en chiffres ("17"). Tout le reste ("abc", "", "17.5", "-1", "0") est
 * refusé, au lieu de laisser `Number()` produire `NaN` jusqu'à la requête SQL.
 */
export function parseLegislature(raw: string): Result<number, "INVALID_INPUT"> {
    if (!/^\d+$/.test(raw)) return err("INVALID_INPUT");
    const legislature = Number(raw);
    return legislature > 0 ? ok(legislature) : err("INVALID_INPUT");
}
