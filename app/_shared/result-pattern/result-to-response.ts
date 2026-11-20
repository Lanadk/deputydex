import { NextResponse } from "next/server";
import { Result } from "@/app/_shared/result-pattern/result";
import { AppError } from "@/app/_shared/result-pattern/app-error";
import { cachedJson } from "@/app/_shared/cache/cached-response";

/** Statut HTTP de chaque erreur applicative — seul endroit où cette correspondance existe. */
export const APP_ERROR_STATUS: Record<AppError, number> = {
    NOT_FOUND: 404,
    INVALID_INPUT: 400,
    DB_ERROR: 500,
};

const DEFAULT_MESSAGES: Record<AppError, string> = {
    NOT_FOUND: "Ressource introuvable",
    INVALID_INPUT: "Paramètre invalide",
    DB_ERROR: "Erreur serveur",
};

/**
 * Convertit le `Result` d'un use-case en réponse HTTP :
 * succès → 200 avec en-têtes de cache, erreur → `{ error, message }` avec le
 * statut de `APP_ERROR_STATUS` (jamais mis en cache côté HTTP).
 * `messages` remplace le message par défaut d'une erreur (ex. « Groupe introuvable »).
 */
export function resultToResponse<T, E extends AppError>(
    result: Result<T, E>,
    messages: Partial<Record<E, string>> = {}
): NextResponse {
    if (result.success) return cachedJson(result.data);

    const error = result.error;
    return NextResponse.json(
        { error, message: messages[error] ?? DEFAULT_MESSAGES[error] },
        { status: APP_ERROR_STATUS[error] }
    );
}
