import { AsyncData, useAsyncData } from "@/app/(ui)/_shared/hook/use-async-data";

const sansEffet = () => {};

/**
 * Donnée déjà lue côté serveur (`initial`), avec repli client : si `initial`
 * est `null` (bloc indisponible côté serveur), la donnée est chargée par
 * `fetcher` comme avec `useAsyncData` (chargement, erreur, « Réessayer »).
 * Sinon, aucune requête : la donnée serveur est renvoyée telle quelle.
 */
export function useInitialAsyncData<T>(
    initial: T | null,
    fetcher: (() => Promise<T>) | null,
    key: string
): AsyncData<T> {
    // Toujours appelé (règle des hooks), mais sans requête quand la donnée serveur est là.
    const client = useAsyncData(initial === null ? fetcher : null, key);
    return initial === null ? client : { data: initial, loading: false, error: false, retry: sansEffet };
}
