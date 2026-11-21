/**
 * Outil de mesure des performances, réservé au poste du développeur (voir
 * app/6.DEV-PERF.md). Activé seulement par `NEXT_PUBLIC_DEV_PERF=true` dans
 * `.env.local` — variable absente du `.env` de production : rien n'y est
 * mesuré, et la page /dev/perf comme son API répondent 404.
 *
 * Préfixe NEXT_PUBLIC_ : la même variable pilote le serveur (chronométrage SQL,
 * en-tête Server-Timing) et le navigateur (durée des sections, appels API).
 * Fonctionne aussi en build de production local (`npm run build && npm run start`),
 * qui donne des mesures sans les biais du mode dev.
 */
export const DEV_PERF_ENABLED = process.env.NEXT_PUBLIC_DEV_PERF === "true";
