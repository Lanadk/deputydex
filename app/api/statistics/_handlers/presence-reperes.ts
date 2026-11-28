import { isErr } from "@/app/_shared/result-pattern/result";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { PerimetreLegislature, TOUTES_LEGISLATURES } from "@/app/_shared/statistics/perimetre-legislature";
import { getReperesLegislaturesUseCase } from "@/app/domains/presence/use-cases/get-presence-stats.use-cases";
import { EchelleReperes } from "@/app/domains/presence/presence-reperes";
import { prismaPresenceStatsRepository } from "@/app/infrastructure/presence/repositories/prisma-presence-stats.repository";

/** Libellés de l'axe d'une donnée (points, ou items de toutes les séries). */
function libellesDe(raw: RawStatData): string[] {
    if (raw.shape === "timeseries") return raw.points.map((p) => p.label);
    if (raw.shape === "multi-series") return Array.from(new Set(raw.series.flatMap((s) => s.items.map((i) => i.label))));
    return [];
}

/**
 * Ajoute à une courbe « toutes législatures » les repères « Début de la Nᵉ
 * législature » (calculés depuis param_legislatures, dans l'échelle de ses
 * libellés). Sans effet hors périmètre « toutes » ou sans échelle. Une panne
 * des repères ne bloque pas la courbe : elle s'affiche sans.
 */
export async function avecReperes(raw: RawStatData, perimetre: PerimetreLegislature | undefined, echelle?: EchelleReperes): Promise<RawStatData> {
    if (perimetre !== TOUTES_LEGISLATURES || !echelle) return raw;
    const reperes = await getReperesLegislaturesUseCase(prismaPresenceStatsRepository, echelle, libellesDe(raw));
    return isErr(reperes) || reperes.data.length === 0 ? raw : { ...raw, markers: reperes.data };
}
