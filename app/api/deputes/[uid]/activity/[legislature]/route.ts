import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getDeputeActivityUseCase } from "@/app/domains/deputes/use-cases/get-depute-activity.use-case";
import { prismaDeputeActivityRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-activity.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getDeputeActivityUseCase(prismaDeputeActivityRepository, uid, parsed.data),
        ["depute-activity", uid, legislature]
    );

    return resultToResponse(result);
}
