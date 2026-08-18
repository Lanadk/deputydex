import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";

/**
 * Signature commune à tout handler serveur du catalogue Statistiques — voir
 * `stat-handlers.registry.ts` pour comment les handlers par domaine
 * (`acteurs.handlers.ts`, `groupes.handlers.ts`...) s'assemblent, et
 * `route.ts` pour l'unique point d'entrée HTTP qui les résout.
 */
export type StatHandler = (params: StatFetchParams) => Promise<RawStatData | null>;
