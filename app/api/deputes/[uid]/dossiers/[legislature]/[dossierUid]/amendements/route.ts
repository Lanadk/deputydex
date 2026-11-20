import { isErr } from "@/app/_shared/result-pattern/result";
import { resultToResponse } from "@/app/_shared/result-pattern/result-to-response";
import { cachedResult } from "@/app/_shared/cache/cached-response";
import { parseLegislature } from "@/app/domains/legislatures/parse-legislature";
import { getDeputeDossierAmendementsUseCase } from "@/app/domains/deputes/use-cases/get-depute-dossier-amendements.use-case";
import { prismaDeputeDossiersRepository } from "@/app/infrastructure/deputes/repositories/prisma-depute-dossiers.repository";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string; dossierUid: string }> }
): Promise<Response> {
    const { uid, legislature, dossierUid } = await params;
    const parsed = parseLegislature(legislature);
    if (isErr(parsed)) return resultToResponse(parsed);

    const result = await cachedResult(
        () => getDeputeDossierAmendementsUseCase(prismaDeputeDossiersRepository, uid, parsed.data, dossierUid),
        ["depute-dossier-amendements", uid, legislature, dossierUid]
    );

    return resultToResponse(result);
}
