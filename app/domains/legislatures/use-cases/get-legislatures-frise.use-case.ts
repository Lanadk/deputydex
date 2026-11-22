import { ok, Result, isErr } from "@/app/_shared/result-pattern/result";
import { fromRepository } from "@/app/_shared/result-pattern/app-error";
import { ILegislatureOrganisationRepository } from "@/app/domains/legislatures/repositories/ILegislatureOrganisationRepository";
import { FrisePeriodeDTO, LegislaturesFriseDTO } from "@/app/domains/legislatures/dto/legislatures-frise.dto";
import { chevauche, finParDissolution, libelleLegislature, libelleMandat, nommerGouvernements } from "@/app/domains/legislatures/institutions";
import { mapGouvernementToPeriode, mapPresidentAssembleeToPeriode } from "@/app/domains/legislatures/mappers/legislature-organisation.mapper";

/** Périodes de la frise, dans l'ordre chronologique. */
export function sortPeriodes(periodes: FrisePeriodeDTO[]): FrisePeriodeDTO[] {
    return [...periodes].sort((a, b) => (a.debut < b.debut ? -1 : a.debut > b.debut ? 1 : 0));
}

/**
 * Frise chronologique des législatures couvertes : Présidence de la République,
 * législatures, gouvernements et présidence de l'Assemblée, de la première
 * législature (ou du premier gouvernement, s'il est antérieur) à `aujourdhui`.
 */
export async function getLegislaturesFriseUseCase(
    repository: ILegislatureOrganisationRepository,
    aujourdhui: string
): Promise<Result<LegislaturesFriseDTO, "DB_ERROR">> {
    const read = await fromRepository(() => Promise.all([
        repository.getLegislatures(),
        repository.getPremiersMinistres(),
        repository.getPresidentsAssemblee(),
        repository.getMandatsPresidentiels(),
        repository.getEvenementsInstitutionnels(),
    ]));
    if (isErr(read)) return read;
    const [legislatures, premiersMinistres, presidentsAssemblee, mandatsPresidentiels, evenements] = read.data;

    const plusAncienne = (dates: string[]) => [...dates].sort((a, b) => a.localeCompare(b))[0];
    const debutLegislatures = plusAncienne(legislatures.map((l) => l.debut)) ?? aujourdhui;
    const gouvernements = nommerGouvernements(premiersMinistres)
        .filter((g) => chevauche(g.debut, g.fin, debutLegislatures, aujourdhui));
    const debut = plusAncienne([debutLegislatures, ...gouvernements.map((g) => g.debut)]);
    const fin = aujourdhui;

    return ok({
        debut,
        fin,
        legislatures: [...legislatures]
            .sort((a, b) => b.number - a.number)
            .map((l) => ({ numero: l.number, debut: l.debut, fin: l.fin, finParDissolution: finParDissolution(l, evenements) })),
        couloirs: [
            {
                id: "presidence",
                libelle: "Présidence de la République",
                periodes: sortPeriodes(mandatsPresidentiels
                    .filter((m) => chevauche(m.debut, m.fin, debut, fin))
                    .map((m) => ({
                        id: `presidence-${m.debut}`,
                        libelle: m.president,
                        detail: libelleMandat(m.mandat_numero),
                        debut: m.debut,
                        fin: m.fin,
                        href: null,
                    }))),
            },
            {
                id: "legislatures",
                libelle: "Législatures",
                periodes: sortPeriodes(legislatures.map((l) => ({
                    id: `legislature-${l.number}`,
                    libelle: libelleLegislature(l.number),
                    detail: null,
                    debut: l.debut,
                    fin: l.fin,
                    href: null,
                }))),
            },
            {
                id: "gouvernements",
                libelle: "Gouvernements",
                periodes: sortPeriodes(gouvernements.map(mapGouvernementToPeriode)),
            },
            {
                id: "assemblee",
                libelle: "Présidence de l'Assemblée",
                periodes: sortPeriodes(presidentsAssemblee.map(mapPresidentAssembleeToPeriode)),
            },
        ],
        evenements: evenements
            .filter((e) => e.date >= debut && e.date <= fin)
            .map((e) => ({ date: e.date, libelle: e.libelle })),
    });
}
