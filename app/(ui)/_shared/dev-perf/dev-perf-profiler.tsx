"use client";

import React, { Profiler } from "react";
import { DEV_PERF_ENABLED } from "@/app/_shared/dev-perf/dev-perf.config";
import { recordComponentRender } from "@/app/(ui)/_shared/dev-perf/dev-perf.client";

/**
 * Outil de perf (dev seulement) : mesure le temps de rendu React de `children`
 * avec `<Profiler>`, rangé sous « type|identifiant » dans /dev/perf (onglet
 * « Rendu des composants »). Sans l'outil, rend `children` tel quel.
 *
 * React ne mesure qu'en mode dev ou dans un build de profilage
 * (`npm run build:profile`) ; dans un build de prod ordinaire, rien n'est mesuré.
 */
export function DevPerfProfiler({ type, id, children }: { type: string; id: string; children: React.ReactNode }) {
    if (!DEV_PERF_ENABLED) return <>{children}</>;
    return <Profiler id={`${type}|${id}`} onRender={recordComponentRender}>{children}</Profiler>;
}
