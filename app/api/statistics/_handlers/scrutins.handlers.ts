import { isOk } from "@/app/_shared/result-pattern/result";
import { getScrutinsParticipationStatUseCase } from "@/app/domains/scrutins/use-cases/get-scrutins-participation-stat.use-case";
import { prismaScrutinsStatsRepository } from "@/app/infrastructure/scrutins/repositories/prisma-scrutins-stats.repository";
import { StatHandler } from "@/app/api/statistics/_handlers/stat-handler.types";

export const SCRUTINS_STAT_HANDLERS: Record<string, StatHandler> = {
    participation: async () => {
        const result = await getScrutinsParticipationStatUseCase(prismaScrutinsStatsRepository);
        if (!isOk(result)) return null;
        return { shape: "timeseries", points: result.data.points };
    },
};
