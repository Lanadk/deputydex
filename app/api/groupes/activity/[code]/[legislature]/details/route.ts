import {err, isErr} from "@/app/_shared/result-pattern/result";
import {resultToResponse} from "@/app/_shared/result-pattern/result-to-response";
import {cachedResult} from "@/app/_shared/cache/cached-response";
import {parseLegislature} from "@/app/domains/legislatures/parse-legislature";
import {getGroupeActivityDetailsUseCase} from "@/app/domains/groupes/use-cases/get-groupe-activity-details.use-case";
import {
    prismaGroupeActivityDetailsRepository
} from "@/app/infrastructure/groupes/repositories/prisma-groupe-activity-details.repository";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ code: string; legislature: string }> }
): Promise<Response> {
    const { code, legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const dateParam = new URL(req.url).searchParams.get("date");
    const date = dateParam ? new Date(dateParam) : null;
    if (!dateParam || !date || Number.isNaN(date.getTime())) {
        return resultToResponse(err("INVALID_INPUT"), { INVALID_INPUT: "Paramètre date absent ou invalide" });
    }

    const result = await cachedResult(
        () => getGroupeActivityDetailsUseCase(prismaGroupeActivityDetailsRepository, code, parsed.data, date),
        ["groupe-activity-details", code, legislature, dateParam]
    );

    return resultToResponse(result);
}
