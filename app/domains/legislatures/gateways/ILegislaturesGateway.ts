import {LegislatureDTO} from "@/app/domains/legislatures/dto/legislature.dto";
import {PresidenceAssembleeDTO} from "@/app/domains/legislatures/dto/presidence-assemblee.dto";
import {LegislaturesFriseDTO} from "@/app/domains/legislatures/dto/legislatures-frise.dto";
import {LegislatureOrganisationDTO} from "@/app/domains/legislatures/dto/legislature-organisation.dto";
import {LegislatureChiffresDTO} from "@/app/domains/legislatures/dto/legislature-chiffres.dto";


export interface ILegislaturesGateway {
    getCurrent(): Promise<LegislatureDTO | null>;
    getAll(): Promise<LegislatureDTO[]>;
    /** Null si aucune présidence n'est connue pour la législature. */
    getPresidenceAssemblee(legislature: number): Promise<PresidenceAssembleeDTO | null>;
    getFrise(): Promise<LegislaturesFriseDTO>;
    getOrganisation(legislature: number): Promise<LegislatureOrganisationDTO>;
    getChiffres(legislature: number): Promise<LegislatureChiffresDTO>;
}