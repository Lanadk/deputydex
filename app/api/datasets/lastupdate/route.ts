
import {isOk} from "@/app/_shared/result-pattern/result";
import {NextResponse} from "next/server";
import {getLastUpdateUseCase} from "@/app/domains/datasets/use-cases/get-last-update.use-case";
import {prismaDataSetsRepository} from "@/app/infrastructure/datasets/repositories/prisma-datasets-repository";
import {cachedJson, cachedRead} from "@/app/_shared/cache/cached-response";

export async function GET(): Promise<Response> {
    try {
        const result = await cachedRead(
            () => getLastUpdateUseCase(prismaDataSetsRepository),
            ["datasets-lastupdate"]
        );

        if (isOk(result)) {
            return cachedJson(result.data);
        }

        return NextResponse.json({ error: "Failed to fetch all legislatures" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch all legislatures" }, { status: 500 });
    }
}