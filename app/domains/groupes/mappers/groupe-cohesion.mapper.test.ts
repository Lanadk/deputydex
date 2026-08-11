import { mapEntityToGroupeCohesionDTO } from "@/app/domains/groupes/mappers/groupe-cohesion.mapper";
import { GroupeCohesionEntity } from "@/app/domains/groupes/entities/groupe-cohesion.entity";

function makeEntity(overrides: Partial<GroupeCohesionEntity> = {}): GroupeCohesionEntity {
    return {
        evolutionCohesionLegislature: [],
        cohesionLegislature: { nb_scrutins_couverts: 120, taux_cohesion: 0.876 },
        couvertureScrutins: { nb_scrutins_couverts: 120, nb_scrutins_legislature: 150, taux_couverture_scrutins: 0.8 },
        participationLegislature: { taux_participation_legislature: 0.62 },
        proximiteGouvernement: { taux_proximite: 0.734 },
        ...overrides,
    };
}

describe("mapEntityToGroupeCohesionDTO — evolutionCohesionLegislature", () => {
    it("formats each month as yyyy-MM and passes the taux_cohesion through as value", () => {
        const entity = makeEntity({
            evolutionCohesionLegislature: [
                { mois: new Date("2024-07-15"), taux_cohesion: 0.92 },
                { mois: new Date("2024-08-01"), taux_cohesion: 0.87 },
            ],
        });

        expect(mapEntityToGroupeCohesionDTO(entity).evolutionCohesionLegislature).toEqual([
            { key: "2024-07", value: 0.92 },
            { key: "2024-08", value: 0.87 },
        ]);
    });

    it("defaults a null taux_cohesion to 0", () => {
        const entity = makeEntity({
            evolutionCohesionLegislature: [{ mois: new Date("2024-07-15"), taux_cohesion: null }],
        });

        expect(mapEntityToGroupeCohesionDTO(entity).evolutionCohesionLegislature).toEqual([
            { key: "2024-07", value: 0 },
        ]);
    });

    it("maps an empty history to an empty list", () => {
        expect(mapEntityToGroupeCohesionDTO(makeEntity()).evolutionCohesionLegislature).toEqual([]);
    });
});

describe("mapEntityToGroupeCohesionDTO — indicateurs agrégés", () => {
    it("rounds tauxCohesionLegislature to a whole percentage", () => {
        const entity = makeEntity({ cohesionLegislature: { nb_scrutins_couverts: 120, taux_cohesion: 0.876 } });
        expect(mapEntityToGroupeCohesionDTO(entity).tauxCohesionLegislature).toBe(88);
    });

    it("returns null for tauxCohesionLegislature when there is no cohesionLegislature row", () => {
        const entity = makeEntity({ cohesionLegislature: null });
        expect(mapEntityToGroupeCohesionDTO(entity).tauxCohesionLegislature).toBeNull();
    });

    it("passes nbScrutinsCouverts through from couvertureScrutins", () => {
        const entity = makeEntity({
            couvertureScrutins: { nb_scrutins_couverts: 42, nb_scrutins_legislature: 150, taux_couverture_scrutins: 0.28 },
        });
        expect(mapEntityToGroupeCohesionDTO(entity).nbScrutinsCouverts).toBe(42);
    });

    it("returns null for nbScrutinsCouverts when there is no couvertureScrutins row", () => {
        const entity = makeEntity({ couvertureScrutins: null });
        expect(mapEntityToGroupeCohesionDTO(entity).nbScrutinsCouverts).toBeNull();
    });

    it("passes tauxParticipationLegislature through as-is (no rounding)", () => {
        const entity = makeEntity({ participationLegislature: { taux_participation_legislature: 0.6217 } });
        expect(mapEntityToGroupeCohesionDTO(entity).tauxParticipationLegislature).toBe(0.6217);
    });

    it("returns null for tauxParticipationLegislature when there is no participationLegislature row", () => {
        const entity = makeEntity({ participationLegislature: null });
        expect(mapEntityToGroupeCohesionDTO(entity).tauxParticipationLegislature).toBeNull();
    });

    it("rounds tauxProximiteGouvernement to a whole percentage", () => {
        const entity = makeEntity({ proximiteGouvernement: { taux_proximite: 0.734 } });
        expect(mapEntityToGroupeCohesionDTO(entity).tauxProximiteGouvernement).toBe(73);
    });

    it("returns null for tauxProximiteGouvernement when there is no proximiteGouvernement row", () => {
        const entity = makeEntity({ proximiteGouvernement: null });
        expect(mapEntityToGroupeCohesionDTO(entity).tauxProximiteGouvernement).toBeNull();
    });
});
