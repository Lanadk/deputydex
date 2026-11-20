import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getDeputeDossierContributionsUseCase } from "@/app/domains/deputes/use-cases/get-depute-dossier-contributions.use-case";
import { prismaDeputeDossiersRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-dossiers.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getDeputeDossierContributionsUseCase(prismaDeputeDossiersRepository, uid, parsed.data),
        ["depute-dossiers", uid, legislature]
    );

    return resultToResponse(result);
}
