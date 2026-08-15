import { NextResponse } from "next/server";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";
import { RawStatData } from "@/app/_shared/statistics/raw-stat-data.types";
import { StatFetchParams } from "@/app/_shared/statistics/stat-scope.types";
import { getActeursAgeDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-age-distribution.use-case";
import { getActeursGenderDistributionUseCase } from "@/app/domains/acteurs/use-cases/get-acteurs-gender-distribution.use-case";
import { getActeurMandatsCountUseCase } from "@/app/domains/acteurs/use-cases/get-acteur-mandats-count.use-case";
import { prismaActeursStatsRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository";
import { getGroupeStatPariteUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-parite.use-case";
import { getGroupeStatEffectifsUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-effectifs.use-case";
import { getGroupeStatCohesionUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-cohesion.use-case";
import { getGroupeStatPariteMoyenneUseCase } from "@/app/domains/groupes/use-cases/get-groupe-stat-parite-moyenne.use-case";
import { prismaGroupesStatsRepository } from "@/app/infrastructure/groupes/repositories/prisma-groupes-stats.repository";
import { getLegislaturesPariteEvolutionUseCase } from "@/app/domains/legislatures/use-cases/get-legislatures-parite-evolution.use-case";
import { prismaLegislaturesStatsRepository } from "@/app/infrastructure/legislatures/repositories/prisma-legislatures-stats.repository";
import { getVotesPositionsStatUseCase } from "@/app/domains/votes/use-cases/get-votes-positions-stat.use-case";
import { prismaVotesStatsRepository } from "@/app/infrastructure/votes/repositories/prisma-votes-stats.repository";
import { getScrutinsParticipationStatUseCase } from "@/app/domains/scrutins/use-cases/get-scrutins-participation-stat.use-case";
import { prismaScrutinsStatsRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutins-stats.repository";

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
        "age-distribution": async (params) => {
            const legislature = params.filters?.legislature as number | undefined;
            const result = await getActeursAgeDistributionUseCase(prismaActeursStatsRepository, legislature);
            if (!isOk(result)) return null;
            return { shape: "distribution", items: result.data.items };
        },
        parite: async (params) => {
            const legislature = params.filters?.legislature as number | undefined;
            const result = await getActeursGenderDistributionUseCase(prismaActeursStatsRepository, legislature);
            if (!isOk(result)) return null;
            return { shape: "distribution", items: result.data.items };
        },
        mandats: async (params) => {
            if (!params.entityId) return null;
            const result = await getActeurMandatsCountUseCase(prismaActeursStatsRepository, params.entityId);
            if (!isOk(result)) return null;
            return { shape: "scalar", value: result.data.count, label: "mandats" };
        },
    },
    groupes: {
        parite: async (params) => {
            const code = params.entityId;
            const legislature = params.filters?.legislature as number | undefined;
            if (!code || !legislature) return null;

            const result = await getGroupeStatPariteUseCase(prismaGroupesStatsRepository, code, legislature);
            if (!isOk(result)) return null;
            return { shape: "distribution", items: result.data.items };
        },
        effectifs: async (params) => {
            const legislature = params.filters?.legislature as number | undefined;
            if (!legislature) return null;

            const result = await getGroupeStatEffectifsUseCase(prismaGroupesStatsRepository, legislature);
            if (!isOk(result)) return null;
            return { shape: "distribution", items: result.data.items };
        },
        cohesion: async (params) => {
            const code = params.entityId;
            const legislature = params.filters?.legislature as number | undefined;
            if (!code || !legislature) return null;

            const result = await getGroupeStatCohesionUseCase(prismaGroupesStatsRepository, code, legislature);
            if (!isOk(result)) return null;
            return { shape: "timeseries", points: result.data.points };
        },
        // Pas exposée dans GROUPES_STATS (pas une stat du picker) — usage
        // interne par les insights (voir _catalog/insights/) pour situer une
        // stat par rapport à la moyenne du domaine.
        "parite-moyenne": async (params) => {
            const legislature = params.filters?.legislature as number | undefined;
            if (!legislature) return null;

            const result = await getGroupeStatPariteMoyenneUseCase(prismaGroupesStatsRepository, legislature);
            if (!isOk(result)) return null;
            return { shape: "distribution", items: result.data.items };
        },
    },
    votes: {
        positions: async () => {
            const result = await getVotesPositionsStatUseCase(prismaVotesStatsRepository);
            if (!isOk(result)) return null;
            return { shape: "distribution", items: result.data.items };
        },
    },
    scrutins: {
        participation: async () => {
            const result = await getScrutinsParticipationStatUseCase(prismaScrutinsStatsRepository);
            if (!isOk(result)) return null;
            return { shape: "timeseries", points: result.data.points };
        },
    },
    legislatures: {
        parite: async () => {
            const result = await getLegislaturesPariteEvolutionUseCase(prismaLegislaturesStatsRepository);
            if (!isOk(result)) return null;
            return { shape: "timeseries", points: result.data.points };
        },
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
