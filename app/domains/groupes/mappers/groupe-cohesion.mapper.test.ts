import { mapEntityToGroupeCohesionDTO } from "@/app/domains/groupes/mappers/groupe-cohesion.mapper";
import { GroupeCohesionEntity } from "@/app/domains/groupes/entities/groupe-cohesion.entity";

describe("mapEntityToGroupeCohesionDTO", () => {
    it("formats each month as yyyy-MM and passes the taux_cohesion through as value", () => {
        const entity: GroupeCohesionEntity = {
            evolutionCohesionLegislature: [
                { mois: new Date("2024-07-15"), taux_cohesion: 0.92 },
                { mois: new Date("2024-08-01"), taux_cohesion: 0.87 },
            ],
        };

        expect(mapEntityToGroupeCohesionDTO(entity)).toEqual({
            evolutionCohesionLegislature: [
                { key: "2024-07", value: 0.92 },
                { key: "2024-08", value: 0.87 },
            ],
        });
    });

    it("defaults a null taux_cohesion to 0", () => {
        const entity: GroupeCohesionEntity = {
            evolutionCohesionLegislature: [{ mois: new Date("2024-07-15"), taux_cohesion: null }],
        };

        expect(mapEntityToGroupeCohesionDTO(entity).evolutionCohesionLegislature).toEqual([
            { key: "2024-07", value: 0 },
        ]);
    });

    it("maps an empty history to an empty list", () => {
        expect(mapEntityToGroupeCohesionDTO({ evolutionCohesionLegislature: [] })).toEqual({
            evolutionCohesionLegislature: [],
        });
    });
});
