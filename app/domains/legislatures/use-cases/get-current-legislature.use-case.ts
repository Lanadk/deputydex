import {ILegislaturesRepository} from "@/app/domains/legislatures/repositories/ILegislaturesRepository";

export async function getCurrentLegislatureUseCase(
    repository: ILegislaturesRepository
) {
    const currentLegislature = await repository.getCurrent();

    if (!currentLegislature) {
        throw new Error("Aucune législature en cours trouvée");
    }

    return currentLegislature;
}