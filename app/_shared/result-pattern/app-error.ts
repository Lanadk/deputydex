import { err, ok, Result } from "@/app/_shared/result-pattern/result";

/**
 * Erreurs applicatives qu'un use-case peut renvoyer. Chaque use-case déclare
 * le sous-ensemble qu'il produit réellement (ex. `Result<DTO, "NOT_FOUND" | "DB_ERROR">`),
 * et `resultToResponse` les traduit en statut HTTP.
 *
 * - `NOT_FOUND`     : l'entité demandée n'existe pas (404).
 * - `INVALID_INPUT` : un paramètre ne respecte pas son format (400).
 * - `DB_ERROR`      : le repository a levé une exception (500).
 */
export type AppError = "NOT_FOUND" | "INVALID_INPUT" | "DB_ERROR";

/**
 * Appelle un repository et convertit son exception en `err("DB_ERROR")`.
 *
 * Règle : un repository LÈVE une exception sur une panne technique (en gardant
 * la cause) et renvoie `null` / une liste vide pour « rien trouvé » ; c'est le
 * use-case qui transforme l'exception en `Result`, via ce helper. L'erreur est
 * journalisée ici, sinon une panne SQL (ex. vue d'agrégation absente) serait
 * invisible côté serveur.
 */
export async function fromRepository<T>(read: () => Promise<T>): Promise<Result<T, "DB_ERROR">> {
    try {
        return ok(await read());
    } catch (e) {
        console.error(e);
        return err("DB_ERROR");
    }
}
