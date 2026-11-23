import { DeputeTendanceEntity } from "@/app/domains/deputes/entities/deputes-tendances.entity";

export interface IDeputesTendancesRepository {
    /** Activité récente des députés de la législature (ceux qui ont une carte) ; `[]` si aucune. */
    getDeputesTendances(legislature: number): Promise<DeputeTendanceEntity[]>;
}
