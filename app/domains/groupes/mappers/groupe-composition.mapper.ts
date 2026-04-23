import {GroupeCompositionEntity} from "@/app/domains/groupes/entities/groupe-composition.entity";
import {GroupeCompositionDTO} from "@/app/domains/groupes/dto/groupe-composition.dto";

export const mapEntityToGroupeCompositionDTO = (
    entity: GroupeCompositionEntity,
): GroupeCompositionDTO => ({
    groupeCountActifMembers: entity.groupeCountMembers ?? undefined,
    groupeAverageMemberAge: entity.averageAge ?? undefined,
    groupeAverageCumulatedMandat: entity.averageCumulatedYears ?? undefined,
    groupeAverageFemmePercent: entity.parite?.pct_femmes ?? undefined,
    groupeParite: {
        homme: entity.parite?.pct_hommes ?? 0,
        femme: entity.parite?.pct_femmes ?? 0,
    },
    groupeTopDepartementsElection: entity.topDepartementsElection.map(row => ({
        label: row.election_departement,
        count: row.nb_acteurs,
    })),
    groupeTopDepartementsNaissance: entity.topDepartementsNaissance.map(row => ({
        label: row.departement,
        count: row.nb_acteurs,
    })),
    groupeTopPaysNaissance: entity.topPaysNaissance.map(row => ({
        label: row.pays,
        count: row.nb_acteurs,
    })),
    groupeProfessionFamilles: {
        totalActeursCount: entity.professionFamilles[0]
            ? Number(entity.professionFamilles[0].nb_total_groupe)
            : 0,
        data: entity.professionFamilles.map(row => ({
            label: row.profession_famille,
            acteursCount: Number(row.nb_acteurs),
            percentInGroupe: Number(row.pct_dans_groupe),
        })),
    },
    groupeProfessionCategories: {
        totalActeursCount: entity.professionCategories[0]
            ? Number(entity.professionCategories[0].nb_total_groupe)
            : 0,
        data: entity.professionCategories.map(row => ({
            label: row.profession_categorie,
            acteursCount: Number(row.nb_acteurs),
            percentInGroupe: Number(row.pct_dans_groupe),
        })),
    },
    groupeTrancheAge: entity.trancheAge.map(row => ({
        label: row.tranche_age,
        acteursCount: Number(row.nb_acteurs),
        percentInGroupe: Number(row.pourcentage),
    })),
    groupeExtremes: entity.extremes ? {
        plusAge: entity.extremes.plusAge && {
            nom: `${entity.extremes.plusAge.prenom} ${entity.extremes.plusAge.nom}`,
            age: entity.extremes.plusAge.age,
        },
        plusJeune: entity.extremes.plusJeune && {
            nom: `${entity.extremes.plusJeune.prenom} ${entity.extremes.plusJeune.nom}`,
            age: entity.extremes.plusJeune.age,
        },
    } : undefined,
});