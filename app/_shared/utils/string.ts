export function normalizeForSearch(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .trim();
}

const NAMED_HTML_ENTITIES: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: "\"",
    apos: "'",
    nbsp: " ",
};

/**
 * Convertit un fragment HTML de l'open data AN (ex. `expose_sommaire` d'un
 * amendement : `<p>…l&#x2019;article…</p>`) en texte brut lisible — balises
 * retirées, entités numériques et usuelles décodées, espaces normalisés.
 * Pas un sanitizer : le résultat est destiné à être affiché comme texte.
 */
export function htmlToPlainText(html: string): string {
    return html
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<\/(p|div|li)>/gi, " ")
        .replace(/<[^>]*>/g, "")
        .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
        .replace(/&([a-z]+);/gi, (match, name: string) => NAMED_HTML_ENTITIES[name.toLowerCase()] ?? match)
        .replace(/\s+/g, " ")
        .trim();
}

/** Met en majuscule la première lettre (ex. "rapporteur pour avis" → "Rapporteur pour avis"). */
export function capitalizeFirst(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
