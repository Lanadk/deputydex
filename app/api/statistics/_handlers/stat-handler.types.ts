import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";
import { Result } from "@/app/_shared/result-pattern/result";
import { AppError } from "@/app/_shared/result-pattern/app-error";

/**
 * Signature commune à tout handler serveur du catalogue Statistiques — voir
 * `stat-handlers.registry.ts` pour comment les handlers par domaine
 * (`acteurs.handlers.ts`, `groupes.handlers.ts`...) s'assemblent, et
 * `route.ts` pour l'unique point d'entrée HTTP qui les résout.
 *
 * Un paramètre requis absent (entityId, filtre législature) → `INVALID_INPUT` ;
 * l'erreur d'un use-case est propagée telle quelle (`DB_ERROR`…).
 */
export type StatHandler = (params: StatFetchParams) => Promise<Result<RawStatData, AppError>>;
