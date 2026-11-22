import { PresidenceAssembleeEntity } from "@/app/domains/legislatures/entities/presidence-assemblee.entity";

export interface IPresidenceAssembleeRepository {
    /** Mandats de président de l'Assemblée de la législature (souvent un seul), dans un ordre quelconque ; [] si aucun. */
    getPresidencesAssemblee(legislature: number): Promise<PresidenceAssembleeEntity[]>;
}
