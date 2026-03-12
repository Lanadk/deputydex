import {ActeurWithMandatsEntity} from "@/app/domains/acteurs/entities/acteurs-mandats.entity";

export interface IFicheDeputeRepository {
    findByIdAndLegislature(
        id: string,
        legislature: number
    ): Promise<ActeurWithMandatsEntity | null>;
}