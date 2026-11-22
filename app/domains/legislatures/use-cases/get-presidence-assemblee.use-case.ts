import { err, isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { IPresidenceAssembleeRepository } from "@/app/domains/legislatures/repositories/IPresidenceAssembleeRepository";
import { PresidenceAssembleeEntity } from "@/app/domains/legislatures/entities/presidence-assemblee.entity";
import { PresidenceAssembleeDTO } from "@/app/domains/legislatures/dto/presidence-assemblee.dto";
import { mapPresidenceAssembleeToDTO } from "@/app/domains/legislatures/mappers/presidence-assemblee.mapper";

/**
 * Présidence à retenir pour une législature : le mandat en cours s'il y en a un,
 * sinon le plus récent (législature close, ou présidence vacante). Un président
 * peut être remplacé en cours de législature (démission, entrée au gouvernement).
 */
export function presidenceEnPlace(mandats: PresidenceAssembleeEntity[]): PresidenceAssembleeEntity | null {
    const plusRecentDabord = [...mandats].sort((a, b) => b.debut.localeCompare(a.debut));
    return plusRecentDabord.find((m) => m.fin === null) ?? plusRecentDabord[0] ?? null;
}

/** Présidence de l'Assemblée d'une législature. NOT_FOUND : aucun mandat de président connu. */
export async function getPresidenceAssembleeUseCase(
    repository: IPresidenceAssembleeRepository,
    legislature: number
): Promise<Result<PresidenceAssembleeDTO, "DB_ERROR" | "NOT_FOUND">> {
    const read = await fromRepository(() => repository.getPresidencesAssemblee(legislature));
    if (isErr(read)) return read;

    const presidence = presidenceEnPlace(read.data);
    if (!presidence) return err("NOT_FOUND");

    return ok(mapPresidenceAssembleeToDTO(presidence));
}
