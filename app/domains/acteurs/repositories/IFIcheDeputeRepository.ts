import {ActeurWithMandatsEntity} from "@/app/domains/acteurs/entities/acteurs-mandats.entity";

export interface IFicheDeputeRepository {
    findByIdAndLegislature(
        id: string,
    ): Promise<ActeurWithMandatsEntity | null>;
}