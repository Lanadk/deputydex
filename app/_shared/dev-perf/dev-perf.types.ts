/** Une requête SQL exécutée pendant un appel d'API. */
export type SqlQueryRecord = {
    /** Texte SQL (tronqué), ou `Modèle.opération` pour une requête Prisma non brute */
    text: string;
    durationMs: number;
    /** Début, en ms depuis le début de l'appel d'API */
    offsetMs: number;
};

/** Un appel d'API, mesuré côté serveur (dans `cachedResult` / `resultToResponse`). */
export type ApiCallRecord = {
    id: number;
    /** Horodatage de fin (ms depuis epoch) */
    at: number;
    /** Clé de l'endpoint : les `keyParts` de `cachedResult` (ex. "groupe-cohesion/RN/17") */
    endpoint: string;
    /** Famille d'endpoint : premier élément des `keyParts` (ex. "groupe-cohesion") */
    family: string;
    status: number;
    totalMs: number;
    /**
     * Temps pendant lequel au moins une requête SQL tourne (requêtes en
     * parallèle comptées une fois) : toujours ≤ totalMs.
     */
    sqlMs: number;
    sqlCount: number;
    /** true : réponse servie par le cache serveur, sans requête SQL */
    cacheHit: boolean;
    queries: SqlQueryRecord[];
    /** Taille du corps JSON de la réponse (octets, UTF-8) */
    bytes: number;
};

/** Une section du moteur de sections, mesurée dans le navigateur. */
export type SectionTimingRecord = {
    kind: "section";
    /** Horodatage de fin (ms depuis epoch), pour la vue en direct */
    at: number;
    /** Identifiant de la visite de page (une par chargement ou navigation) */
    visitId: string;
    path: string;
    sectionId: string;
    /** Début, en ms depuis le début de la visite */
    startMs: number;
    durationMs: number;
    ok: boolean;
};

/** Un appel `fetch` vers /api/, mesuré dans le navigateur. */
export type ClientFetchRecord = {
    kind: "fetch";
    /** Horodatage de fin (ms depuis epoch), pour la vue en direct */
    at: number;
    visitId: string;
    path: string;
    url: string;
    startMs: number;
    durationMs: number;
    status: number;
    /** En-tête Server-Timing renvoyé par l'API (temps SQL, cache…) */
    serverTiming: string | null;
};

/** Web Vitals mesurés (https://web.dev/vitals) : rendu de la page vu par l'utilisateur. */
export const WEB_VITAL_NAMES = ["LCP", "FCP", "CLS", "INP", "TTFB"] as const;
export type WebVitalName = (typeof WEB_VITAL_NAMES)[number];

/** Un Web Vital d'une visite, mesuré dans le navigateur (`useReportWebVitals`). */
export type WebVitalRecord = {
    kind: "vital";
    at: number;
    visitId: string;
    path: string;
    name: WebVitalName;
    /** ms, sauf CLS (score sans unité) */
    value: number;
};

export type ClientPerfRecord = SectionTimingRecord | ClientFetchRecord | WebVitalRecord;

/** Contenu renvoyé par GET /api/dev/perf. */
export type DevPerfSnapshot = {
    apiCalls: ApiCallRecord[];
    client: ClientPerfRecord[];
};
