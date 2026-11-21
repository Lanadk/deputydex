import { NextResponse } from "next/server";
import { Result } from "@/app/_shared/result-pattern/result";
import { AppError } from "@/app/_shared/result-pattern/app-error";
import { cachedJson } from "@/app/_shared/cache/cached-response";
import { DEV_PERF_ENABLED } from "@/app/_shared/dev-perf/dev-perf.config";
import { finishRequestPerf, jsonBytes } from "@/app/_shared/dev-perf/dev-perf.server";

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
    const body = result.success
        ? result.data
        : { error: result.error, message: messages[result.error] ?? DEFAULT_MESSAGES[result.error] };
    const response = result.success
        ? cachedJson(body)
        : NextResponse.json(body, { status: APP_ERROR_STATUS[result.error] });

    // Outil de perf (dev seulement) : en-tête Server-Timing + enregistrement pour /dev/perf (dont poids de la réponse).
    if (DEV_PERF_ENABLED) finishRequestPerf(result, response, jsonBytes(body));
    return response;
}
