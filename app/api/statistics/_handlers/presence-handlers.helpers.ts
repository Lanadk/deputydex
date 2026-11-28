import { err, isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { lirePerimetreLegislature, PerimetreLegislature, TOUTES_LEGISLATURES } from "@/app/_shared/statistics/perimetre-legislature";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";
import { getReperesLegislaturesUseCase } from "@/app/domains/presence/use-cases/get-presence-stats.use-cases";
import { EchelleReperes } from "@/app/domains/presence/presence-reperes";
import { PresenceStatItemDTO, PresenceStatSeriesDTO } from "@/app/domains/presence/dto/presence-stats.dto";
import { prismaPresenceStatsRepository } from "@/app/infrastructure/presence/repositories/prisma-presence-stats.repository";

/**
 * Briques communes des handlers de présence (acteurs, groupes, legislatures) :
 * lecture du périmètre de législature, conversion DTO → forme du catalogue, et
 * repères « Début de la Nᵉ législature » des courbes « toutes ».
 */

// ── DTO du domaine presence → RawStatData ─────────────────────────────────────

export const repartition = (data: { items: PresenceStatItemDTO[] }): RawStatData => ({ shape: "distribution", items: data.items });
export const series = (data: PresenceStatSeriesDTO): RawStatData => ({ shape: "multi-series", series: data.series });
/** Courbe : depuis des points (mois, jours) ou des items (périodes annuelles). */
export const courbe = (data: { items: PresenceStatItemDTO[] } | { points: PresenceStatItemDTO[] }): RawStatData =>
    ({ shape: "timeseries", points: "items" in data ? data.items : data.points });

// ── Repères ───────────────────────────────────────────────────────────────────

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

// ── Handlers ──────────────────────────────────────────────────────────────────

/**
 * Stat sur un périmètre de législature OBLIGATOIRE (`filters.legislature` : un
 * numéro ou « toutes ») : Assemblée et classements de groupes. En « toutes », les
 * courbes reçoivent les repères (`echelle` = format de leurs libellés).
 */
export function parPerimetre<T>(
    run: (perimetre: PerimetreLegislature) => Promise<Result<T, "DB_ERROR">>,
    toRaw: (data: T) => RawStatData,
    echelle?: EchelleReperes,
): StatHandler {
    return async (params) => {
        const perimetre = lirePerimetreLegislature(params.filters?.legislature);
        if (perimetre == null) return err("INVALID_INPUT");

        const result = await run(perimetre);
        if (isErr(result)) return result;
        return ok(await avecReperes(toRaw(result.data), perimetre, echelle));
    };
}

/**
 * Stat d'une ENTITÉ (`entityId`) sur un périmètre FACULTATIF : absent = une
 * série par législature ; un numéro ; « toutes » = combiné (député : son
 * `acteur_uid` est stable d'une législature à l'autre).
 */
export function parEntite<T>(
    run: (entityId: string, perimetre: PerimetreLegislature | undefined) => Promise<Result<T, "DB_ERROR">>,
    toRaw: (data: T) => RawStatData,
    echelle?: EchelleReperes,
): StatHandler {
    return async (params) => {
        if (!params.entityId) return err("INVALID_INPUT");
        const perimetre = lirePerimetreLegislature(params.filters?.legislature);

        const result = await run(params.entityId, perimetre);
        if (isErr(result)) return result;
        return ok(await avecReperes(toRaw(result.data), perimetre, echelle));
    };
}

/**
 * Stat d'une ENTITÉ sur UNE législature précise (groupe : pas identifiable d'une
 * législature à l'autre, « toutes » est refusé).
 */
export function parEntiteEtLegislature<T>(
    run: (entityId: string, legislature: number) => Promise<Result<T, "DB_ERROR">>,
    toRaw: (data: T) => RawStatData,
): StatHandler {
    return async (params) => {
        const legislature = params.filters?.legislature;
        if (!params.entityId || typeof legislature !== "number") return err("INVALID_INPUT");

        const result = await run(params.entityId, legislature);
        if (isErr(result)) return result;
        return ok(toRaw(result.data));
    };
}

/** Refuse la stat en « toutes » (année de mandat : pas de version combinée dans les vues). */
export function sansToutes(handler: StatHandler): StatHandler {
    return async (params) =>
        lirePerimetreLegislature(params.filters?.legislature) === TOUTES_LEGISLATURES ? err("INVALID_INPUT") : handler(params);
}
