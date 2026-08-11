// Mock de `next/cache` pour les tests Jest.
//
// `unstable_cache` s'appuie sur le contexte interne (AsyncLocalStorage) du
// runtime serveur Next.js, qui n'existe que sous `next dev`/`next build`/
// `next start` — pas dans un process Jest/Node brut, même avec
// `@jest-environment node`. Sans ce mock, tout Route Handler qui passe par
// `cachedRead` (voir app/_shared/cache/cached-response.ts) throw avant même
// d'appeler la fonction enveloppée, quel que soit le repository mocké —
// d'où des 500 partout et des repositories jamais invoqués.
//
// Ici, `unstable_cache` retourne simplement la fonction telle quelle (pas de
// cache réel en test, keyParts/options ignorés) : les tests exercent donc le
// vrai comportement métier de la route, pas la couche de cache.
export function unstable_cache<T extends (...args: any[]) => any>(fn: T): T {
    return fn;
}

export const revalidateTag = jest.fn();
export const revalidatePath = jest.fn();
