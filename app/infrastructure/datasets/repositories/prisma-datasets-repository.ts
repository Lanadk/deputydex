import {IDataSetsRepository} from "@/app/domains/datasets/repositories/IDataSetsRepository";
import {prisma} from "@/app/infrastructure/db/prisma/prisma";


export const prismaDataSetsRepository: IDataSetsRepository = {

    async getLastUpdate(): Promise<Date | null> {
        try {
            const last = await prisma.monitorDataSetsUpdate.findFirst({
                orderBy: {
                    createdAt: "desc",
                },
            });

            return last?.createdAt ?? null;
        } catch (error) {
            console.error("Error fetching datasets lastUpdate:", error);
            throw new Error("Failed to fetch datasets lastUpdate");
        }
    },
};