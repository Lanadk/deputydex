import { mapEntitiesToGroupesFeminisationDTO } from "@/app/domains/groupes/mappers/groupes-feminisation.mapper";

const parite = (groupe_code: string, nb_femmes: number, nb_total: number) =>
    ({ groupe_code, groupe_label: groupe_code, nb_hommes: nb_total - nb_femmes, nb_femmes, nb_total });
const mouvement = (groupe_code: string, femmes_arrivees: number, femmes_parties: number) =>
    ({ groupe_code, groupe_label: groupe_code, femmes_arrivees, femmes_parties });

describe("mapEntitiesToGroupesFeminisationDTO", () => {
    it("trie par part de femmes et désigne le plus et le moins féminisé", () => {
        const dto = mapEntitiesToGroupesFeminisationDTO(
            [parite("A", 10, 100), parite("B", 50, 100), parite("C", 30, 100)],
            [mouvement("A", 0, 0), mouvement("B", 0, 0), mouvement("C", 0, 0)]
        );

        expect(dto.groupes.map((g) => g.groupeCode)).toEqual(["B", "C", "A"]);
        expect(dto.plusFeminise?.groupeCode).toBe("B");
        expect(dto.moinsFeminise?.groupeCode).toBe("A");
    });

    it("désigne le groupe aux plus d'arrivées et aux plus de départs de femmes (égalité : le premier)", () => {
        const dto = mapEntitiesToGroupesFeminisationDTO(
            [parite("A", 40, 100), parite("B", 30, 100), parite("C", 20, 100)],
            [mouvement("A", 2, 1), mouvement("B", 5, 3), mouvement("C", 5, 0)]
        );

        expect(dto.plusDeFemmesIntegrees?.groupeCode).toBe("B");
        expect(dto.plusDeFemmesParties?.groupeCode).toBe("B");
    });

    it("null quand aucun groupe n'a d'arrivée ni de départ, ou sans groupe", () => {
        const sansMouvement = mapEntitiesToGroupesFeminisationDTO([parite("A", 10, 100)], [mouvement("A", 0, 0)]);
        expect(sansMouvement.plusDeFemmesIntegrees).toBeNull();
        expect(sansMouvement.plusDeFemmesParties).toBeNull();

        const vide = mapEntitiesToGroupesFeminisationDTO([], []);
        expect(vide).toMatchObject({ groupes: [], plusFeminise: null, moinsFeminise: null, plusDeFemmesIntegrees: null });
    });
});
