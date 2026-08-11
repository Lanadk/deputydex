import { mapEntityToGroupeCompositionDTO } from "@/app/domains/groupes/mappers/groupe-composition.mapper";
import { GroupeCompositionEntity } from "@/app/domains/groupes/entities/groupe-composition.entity";

function makeEntity(overrides: Partial<GroupeCompositionEntity> = {}): GroupeCompositionEntity {
    return {
        groupeCountMembers: 88,
        averageAge: 47.5,
        averageCumulatedYears: 3.2,
        parite: { nb_hommes: 44, nb_femmes: 44, nb_total: 88, pct_hommes: 50, pct_femmes: 50 },
        topDepartementsElection: [{ election_departement: "Paris", nb_acteurs: 5, pct_dans_groupe: 5.6 }],
        topPaysNaissance: [{ pays: "France", nb_acteurs: 80, pct_dans_groupe: 90.9 }],
        topDepartementsNaissance: [{ departement: "Rhône", nb_acteurs: 4, pct_dans_groupe: 4.5 }],
        professionFamilles: [
            { profession_famille: "Enseignants", nb_acteurs: 10, nb_total_groupe: 88, pct_dans_groupe: 11.4 },
        ],
        professionCategories: [
            { profession_categorie: "Parlementaire", nb_acteurs: 70, nb_total_groupe: 88, pct_dans_groupe: 79.5 },
        ],
        trancheAge: [{ tranche_age: "40-49", nb_acteurs: 30, pourcentage: 34.1 }],
        extremes: {
            plusAge: { nom: "Dupont", prenom: "Jean", age: 75 },
            plusJeune: { nom: "Martin", prenom: "Alice", age: 25 },
        },
        ...overrides,
    };
}

describe("mapEntityToGroupeCompositionDTO", () => {
    it("maps parite, breakdowns and extremes into the DTO shape", () => {
        const dto = mapEntityToGroupeCompositionDTO(makeEntity());

        expect(dto.groupeCountActifMembers).toBe(88);
        expect(dto.groupeAverageMemberAge).toBe(47.5);
        expect(dto.groupeAverageFemmePercent).toBe(50);
        expect(dto.groupeParite).toEqual({ homme: 50, femme: 50 });
        expect(dto.groupeTopDepartementsElection).toEqual([{ label: "Paris", count: 5 }]);
        expect(dto.groupeTopPaysNaissance).toEqual([{ label: "France", count: 80 }]);
        expect(dto.groupeTopDepartementsNaissance).toEqual([{ label: "Rhône", count: 4 }]);
        expect(dto.groupeExtremes).toEqual({
            plusAge: { nom: "Jean Dupont", age: 75 },
            plusJeune: { nom: "Alice Martin", age: 25 },
        });
    });

    it("coerces string numeric fields from profession/tranche age rows via Number()", () => {
        const dto = mapEntityToGroupeCompositionDTO(
            makeEntity({
                professionFamilles: [
                    {
                        profession_famille: "Enseignants",
                        nb_acteurs: "10" as unknown as number,
                        nb_total_groupe: "88" as unknown as number,
                        pct_dans_groupe: "11.4" as unknown as number,
                    },
                ],
            })
        );

        expect(dto.groupeProfessionFamilles).toEqual({
            totalActeursCount: 88,
            data: [{ label: "Enseignants", acteursCount: 10, percentInGroupe: 11.4 }],
        });
    });

    it("defaults parite to 0/0 when the repository has no parite row", () => {
        const dto = mapEntityToGroupeCompositionDTO(makeEntity({ parite: null }));

        expect(dto.groupeParite).toEqual({ homme: 0, femme: 0 });
        expect(dto.groupeAverageFemmePercent).toBeUndefined();
    });

    it("omits groupeExtremes entirely when the repository has no extremes", () => {
        const dto = mapEntityToGroupeCompositionDTO(makeEntity({ extremes: null as any }));

        expect(dto.groupeExtremes).toBeUndefined();
    });

    it("defaults totalActeursCount to 0 for empty breakdown lists", () => {
        const dto = mapEntityToGroupeCompositionDTO(
            makeEntity({ professionFamilles: [], professionCategories: [] })
        );

        expect(dto.groupeProfessionFamilles).toEqual({ totalActeursCount: 0, data: [] });
        expect(dto.groupeProfessionCategories).toEqual({ totalActeursCount: 0, data: [] });
    });
});
