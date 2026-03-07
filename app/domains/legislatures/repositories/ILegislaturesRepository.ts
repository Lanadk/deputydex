import {LegislatureEntity} from "@/app/domains/legislatures/entities/legislature.entity";


export interface ILegislaturesRepository {
    getCurrent():Promise<LegislatureEntity | null>;
    getAll():Promise<LegislatureEntity[]>;
}