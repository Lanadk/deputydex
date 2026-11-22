import { err, isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getDeputeActivityDetailsUseCase } from "@/app/domains/deputes/use-cases/get-depute-activity-details.use-case";
import { prismaDeputeActivityDetailsRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-activity-details.repository";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const dateParam = new URL(req.url).searchParams.get("date");
    const date = dateParam ? new Date(dateParam) : null;
    if (!dateParam || !date || Number.isNaN(date.getTime())) {
        return resultToResponse(err("INVALID_INPUT"), { INVALID_INPUT: "Paramètre date absent ou invalide" });
    }

    const result = await cachedResult(
        () => getDeputeActivityDetailsUseCase(prismaDeputeActivityDetailsRepository, uid, parsed.data, date),
        ["depute-activity-details", uid, legislature, dateParam]
    );

    return resultToResponse(result);
}
