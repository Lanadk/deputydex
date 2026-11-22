/**
 * Garde-fou de l'outil de perf : même avec NEXT_PUBLIC_DEV_PERF=true, la page
 * /dev/perf et son API ne répondent qu'aux requêtes faites depuis la machine
 * elle-même. Si la variable se retrouvait un jour dans le .env de production
 * (elle est figée au build), le texte SQL et les temps de réponse ne seraient
 * pas pour autant exposés au public.
 *
 * Une requête est locale si :
 * - son hôte (`Host`) est localhost, 127.0.0.1 ou ::1 ;
 * - et, si elle a traversé un proxy (`X-Forwarded-For` / `X-Real-IP`), que
 *   toutes les adresses indiquées sont locales elles aussi. Derrière le reverse
 *   proxy de production, ces en-têtes portent l'IP du visiteur : refus, même
 *   si le `Host` a été falsifié.
 *
 * C'est une défense en profondeur : la règle reste de ne jamais définir la
 * variable en production.
 */
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function isLoopbackAddress(address: string): boolean {
    const a = address.trim().toLowerCase();
    return a === "127.0.0.1" || a === "::1" || a === "::ffff:127.0.0.1" || a === "localhost";
}

/** Nom d'hôte sans le port (`localhost:3000` → `localhost`, `[::1]:3000` → `[::1]`). */
function hostname(host: string): string {
    const h = host.trim().toLowerCase();
    if (h.startsWith("[")) return h.slice(0, h.indexOf("]") + 1);
    return h.split(":")[0];
}

export function isLocalRequest(headers: Headers): boolean {
    const host = headers.get("host");
    if (!host || !LOOPBACK_HOSTS.has(hostname(host))) return false;

    const forwarded = [headers.get("x-forwarded-for"), headers.get("x-real-ip")]
        .filter((v): v is string => !!v)
        .flatMap((v) => v.split(","));
    return forwarded.every(isLoopbackAddress);
}
