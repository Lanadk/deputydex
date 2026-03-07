import {LegislatureDTO} from "@/app/domains/legislatures/dto/legislature.dto";


export interface ILegislaturesGateway {
    getCurrent(): Promise<LegislatureDTO | null>;
    getAll(): Promise<LegislatureDTO[]>;
}