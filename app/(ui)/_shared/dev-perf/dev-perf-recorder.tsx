"use client";

import { useReportWebVitals } from "next/web-vitals";
// Import pour son effet : installe la mesure des `fetch` /api/ dès le chargement
// du bundle, avant que les pages ne lancent leurs requêtes.
import { recordWebVital } from "@/app/(ui)/_shared/dev-perf/dev-perf.client";

/**
 * Monté par le layout racine seulement avec NEXT_PUBLIC_DEV_PERF=true : charge
 * la mesure côté navigateur sur toutes les pages, y compris celles sans moteur
 * de sections (/deputydex, /groupes…), et relève les Web Vitals. N'affiche rien.
 */
export function DevPerfRecorder() {
    // Référence de fonction stable (fonction de module) : Next ne renvoie pas les mêmes mesures deux fois.
    useReportWebVitals(recordWebVital);
    return null;
}
