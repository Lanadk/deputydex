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
        // TODO: mock — remplacer par une vraie requête (civilite) quand le backend sera branché.
        parite: async () => ({
            shape: "distribution",
            items: [
                { label: "Hommes", value: 64 },
                { label: "Femmes", value: 36 },
            ],
        }),
        // TODO: mock — remplacer par une vraie requête (mandats) quand le backend sera branché.
        mandats: async () => ({ shape: "scalar", value: 2, label: "mandats" }),
    },
    // TODO: mock — le backend "groupes" existe (IGroupeCompositionRepository,
    // IGroupeCohesionRepository...) mais n'est pas encore branché ici.
    groupes: {
        parite: async () => ({
            shape: "distribution",
            items: [
                { label: "Hommes", value: 65 },
                { label: "Femmes", value: 35 },
            ],
        }),
        effectifs: async () => ({
            shape: "distribution",
            items: [
                { label: "RN", value: 88 },
                { label: "EPR", value: 92 },
                { label: "SOC", value: 66 },
                { label: "LFI", value: 71 },
                { label: "DR", value: 47 },
                { label: "ECOS", value: 38 },
                { label: "GDR", value: 17 },
                { label: "HOR", value: 33 },
            ],
        }),
        cohesion: async () => ({
            shape: "timeseries",
            points: [
                { label: "Sept.", value: 82 },
                { label: "Oct.", value: 85 },
                { label: "Nov.", value: 79 },
                { label: "Déc.", value: 88 },
                { label: "Jan.", value: 91 },
            ],
        }),
    },
    // Aucun backend "votes" n'existe encore — entièrement mocké.
    votes: {
        positions: async () => ({
            shape: "distribution",
            items: [
                { label: "Pour", value: 210 },
                { label: "Contre", value: 180 },
                { label: "Abstention", value: 40 },
                { label: "Non-votant", value: 147 },
            ],
        }),
    },
    // Aucun backend "scrutins" n'existe encore — entièrement mocké.
    scrutins: {
        participation: async () => ({
            shape: "timeseries",
            points: [
                { label: "Sept.", value: 78 },
                { label: "Oct.", value: 81 },
                { label: "Nov.", value: 74 },
                { label: "Déc.", value: 69 },
                { label: "Jan.", value: 83 },
            ],
        }),
    },
    // TODO: mock — le backend "legislatures" existe (ILegislaturesRepository)
    // mais n'est pas encore branché ici.
    legislatures: {
        parite: async () => ({
            shape: "timeseries",
            points: [
                { label: "XVᵉ", value: 39 },
                { label: "XVIᵉ", value: 37.3 },
                { label: "XVIIᵉ", value: 36.1 },
            ],
        }),
    },
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
