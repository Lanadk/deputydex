// Stub pour le package `server-only` en environnement Jest.
// En prod, `server-only` throw si son module est importé depuis un bundle
// client — Next.js sait l'ignorer via son propre webpack alias, mais Jest ne
// tourne pas dans ce contexte et importerait le vrai package, qui throw
// inconditionnellement. On le remplace par un module vide (le seul usage
// réel est `import "server-only"` pour son effet de bord).
export {};
