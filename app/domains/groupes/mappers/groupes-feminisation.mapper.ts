import {
    GroupeFeminisationMouvementRow,
    GroupeStatPariteParGroupeRow,
} from "@/app/domains/groupes/entities/groupe-stats-catalog.entity";
import { GroupeFeminisationRowDTO, GroupesFeminisationDTO } from "@/app/domains/groupes/dto/groupes-feminisation.dto";

/**
 * Fusionne les deux entités (parité par groupe + mouvements de femmes) par
 * `groupe_code` — les deux requêtes partagent le même périmètre de groupes
 * (voir `prisma-groupes-stats.repository.ts`, `getPariteParGroupe` /
 * `getFeminisationMouvements`), donc chaque ligne de parité a toujours sa
 * ligne de mouvements correspondante ; `?? { femmes_arrivees: 0, femmes_parties: 0 }`
 * ne joue qu'en défense (un groupe sans aucun mouvement pourrait en théorie
 * être absent du second jeu de lignes).
 */
export function mapEntitiesToGroupesFeminisationDTO(
    pariteRows: GroupeStatPariteParGroupeRow[],
    mouvementRows: GroupeFeminisationMouvementRow[]
): GroupesFeminisationDTO {
    const mouvementsByCode = new Map(mouvementRows.map((row) => [row.groupe_code, row]));

    const groupes: GroupeFeminisationRowDTO[] = pariteRows
        .map((row) => {
            const mouvement = mouvementsByCode.get(row.groupe_code);
            return {
                groupeCode: row.groupe_code,
                groupeLabel: row.groupe_label ?? row.groupe_code,
                nbHommes: row.nb_hommes,
                nbFemmes: row.nb_femmes,
                nbTotal: row.nb_total,
                pctFemmes: row.nb_total > 0 ? Math.round((row.nb_femmes / row.nb_total) * 1000) / 10 : 0,
                femmesArrivees: mouvement?.femmes_arrivees ?? 0,
                femmesParties: mouvement?.femmes_parties ?? 0,
            };
        })
        .sort((a, b) => b.pctFemmes - a.pctFemmes);

    const withArrivees = groupes.filter((g) => g.femmesArrivees > 0);
    const withParties = groupes.filter((g) => g.femmesParties > 0);

    return {
        groupes,
        plusFeminise: groupes[0] ?? null,
        moinsFeminise: groupes.length > 0 ? groupes[groupes.length - 1] : null,
        plusDeFemmesIntegrees:
            withArrivees.length > 0
                ? withArrivees.reduce((max, g) => (g.femmesArrivees > max.femmesArrivees ? g : max))
                : null,
        plusDeFemmesParties:
            withParties.length > 0
                ? withParties.reduce((max, g) => (g.femmesParties > max.femmesParties ? g : max))
                : null,
    };
}
