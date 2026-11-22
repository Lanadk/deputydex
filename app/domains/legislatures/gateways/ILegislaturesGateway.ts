import {LegislatureDTO} from "@/app/domains/legislatures/dto/legislature.dto";
import {PresidenceAssembleeDTO} from "@/app/domains/legislatures/dto/presidence-assemblee.dto";


export interface ILegislaturesGateway {
    getCurrent(): Promise<LegislatureDTO | null>;
    getAll(): Promise<LegislatureDTO[]>;
    /** Null si aucune présidence n'est connue pour la législature. */
    getPresidenceAssemblee(legislature: number): Promise<PresidenceAssembleeDTO | null>;
}