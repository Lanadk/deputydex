import { NextResponse } from "next/server";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";
import { getActeursAgeDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-age-distribution.use-case";
import { prismaActeursStatsRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository";

type StatHandler = (params: StatFetchParams) => Promise<RawStatData | null>;

/**
 * Registre SERVEUR des stats du catalogue : symétrique du registre client
 * (StatDefinition[] sous statistics/_domains/<domain>/registry.ts) mais
 * branche use-case + repository Prisma au lieu de title/category/keywords.
 * Point d'entrée unique pour tout le catalogue, quel que soit le domaine —
 * ajouter une stat = ajouter une entrée ici + son pendant client, jamais une
 * nouvelle route.
 */
const STAT_HANDLERS: Record<string, Record<string, StatHandler>> = {
    acteurs: {
        "age-distribution": async () => {
            const result = await getActeursAgeDistributionUseCase(prismaActeursStatsRepository);
            if (!isOk(result)) return null;
            return { shape: "distribution", items: result.data.items };
        },
    },
    groupes: {},
    votes: {},
    scrutins: {},
    legislatures: {},
};

export async function GET(
    req: Request,
    { params }: { params: Promise<{ domain: string; statId: string }> }
): Promise<Response> {
    const { domain, statId } = await params;

    const handler = STAT_HANDLERS[domain]?.[statId];
    if (!handler) {
        return NextResponse.json({ error: `Stat introuvable : ${domain}/${statId}` }, { status: 404 });
    }

    try {
        const url = new URL(req.url);
        const entityId = url.searchParams.get("entityId") ?? undefined;
        const filtersRaw = url.searchParams.get("filters");
        const filters = filtersRaw ? JSON.parse(filtersRaw) : undefined;

        const data = await cachedRead(
            () => handler({ entityId, filters }),
            ["stat", domain, statId, entityId ?? "", filtersRaw ?? ""]
        );

        if (!data) {
            return NextResponse.json({ error: `Failed to compute stat ${domain}/${statId}` }, { status: 500 });
        }

        return cachedJson(data);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: `Failed to compute stat ${domain}/${statId}` }, { status: 500 });
    }
}
