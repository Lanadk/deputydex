import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getDeputesListUseCase } from "@/app/domains/deputes/use-cases/get-deputes-list.use-case";
import { prismaDeputeListRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-list.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ legislature: string }> }
): Promise<Response> {
    const { legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getDeputesListUseCase(prismaDeputeListRepository, parsed.data),
        ["depute-list", legislature]
    );

    return resultToResponse(result);
}
