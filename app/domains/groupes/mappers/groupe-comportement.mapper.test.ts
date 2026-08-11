import { mapEntityToGroupeComportementDTO } from "@/app/domains/groupes/mappers/groupe-comportement.mapper";
import { GroupeComportementEntity } from "@/app/domains/groupes/entities/groupe-comportement.entity";

describe("mapEntityToGroupeComportementDTO", () => {
    it("formats each month as yyyy-MM and passes the participation rate through as value", () => {
        const entity: GroupeComportementEntity = {
            participationLegislature: [
                { mois: new Date("2024-07-15"), taux_participation_moyen_deputes: 0.75 },
            ],
        };

        expect(mapEntityToGroupeComportementDTO(entity)).toEqual({
            evolutionParticipationLegislature: [{ key: "2024-07", value: 0.75 }],
        });
    });

    it("defaults a null participation rate to 0", () => {
        const entity: GroupeComportementEntity = {
            participationLegislature: [{ mois: new Date("2024-07-15"), taux_participation_moyen_deputes: null }],
        };

        expect(mapEntityToGroupeComportementDTO(entity).evolutionParticipationLegislature).toEqual([
            { key: "2024-07", value: 0 },
        ]);
    });
});
