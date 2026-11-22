import { err, isErr, ok, Result } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { ILegislatureOrganisationRepository } from "@/app/domains/legislatures/repositories/ILegislatureOrganisationRepository";
import { EntreeEnCoursRow } from "@/app/domains/legislatures/entities/legislature-organisation.entity";
import { LegislatureChiffresDTO } from "@/app/domains/legislatures/dto/legislature-chiffres.dto";
import { chevauche, joursEntre } from "@/app/domains/legislatures/institutions";
import { LIBELLES_MOTIF_ENTREE, MotifEntree, motifEntree } from "@/app/domains/legislatures/motifs-entree";

/**
 * Entrées en cours de législature regroupées par motif (voir `motifEntree`),
 * du plus fréquent au moins fréquent (à égalité : ordre des libellés).
 */
export function entreesParMotif(entrees: EntreeEnCoursRow[]): LegislatureChiffresDTO["entreesParMotif"] {
    const totaux = new Map<MotifEntree, number>();
    for (const e of entrees) totaux.set(motifEntree(e.cause), (totaux.get(motifEntree(e.cause)) ?? 0) + e.nombre);
    const ordre = Object.keys(LIBELLES_MOTIF_ENTREE) as MotifEntree[];
    return [...totaux.entries()]
        .map(([motif, nombre]) => ({ motif, libelle: LIBELLES_MOTIF_ENTREE[motif], nombre }))
        .sort((a, b) => b.nombre - a.nombre || ordre.indexOf(a.motif) - ordre.indexOf(b.motif));
}

/** Chiffres clés d'une législature. NOT_FOUND : législature inconnue. */
export async function getLegislatureChiffresUseCase(
    repository: ILegislatureOrganisationRepository,
    legislature: number,
    aujourdhui: string
): Promise<Result<LegislatureChiffresDTO, "DB_ERROR" | "NOT_FOUND">> {
    const read = await fromRepository(() => Promise.all([
        repository.getLegislatures(),
        repository.getPremiersMinistres(),
        repository.getChiffres(legislature),
        repository.getEntreesEnCours(legislature),
    ]));
    if (isErr(read)) return read;
    const [legislatures, premiersMinistres, chiffres, entrees] = read.data;

    const periode = legislatures.find((l) => l.number === legislature);
    if (!periode) return err("NOT_FOUND");
    const fin = periode.fin ?? aujourdhui;

    return ok({
        legislature,
        debut: periode.debut,
        fin: periode.fin,
        dureeJours: joursEntre(periode.debut, fin),
        scrutins: chiffres?.scrutins ?? 0,
        deputesAyantSiege: chiffres?.deputes_ayant_siege ?? 0,
        gouvernements: premiersMinistres.filter((p) => chevauche(p.debut, p.fin, periode.debut, fin)).length,
        entreesEnCours: entrees.reduce((total, e) => total + e.nombre, 0),
        entreesParMotif: entreesParMotif(entrees),
    });
}
