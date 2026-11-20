import { mapScrutinGroupeVoteEntityToDTO } from "@/app/domains/scrutins/mappers/scrutin-groupe-vote.mapper";
import { ScrutinGroupeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-groupe-vote.entity";

const baseEntity: ScrutinGroupeVoteEntity = {
    groupe_code: "RN",
    groupe_label: "Rassemblement National",
    nombre_membres: 121,
    position_majoritaire: "pour",
    pour: 64,
    contre: 3,
    abstentions: 0,
    non_votants: 0,
};

describe("mapScrutinGroupeVoteEntityToDTO", () => {
    it("expose le décompte et la position majoritaire traduite", () => {
        expect(mapScrutinGroupeVoteEntityToDTO(baseEntity)).toEqual({
            groupeCode: "RN",
            groupeLabel: "Rassemblement National",
            nombreMembres: 121,
            pour: 64,
            contre: 3,
            abstentions: 0,
            nonVotants: 0,
            positionMajoritaire: "pour",
            positionMajoritaireLabel: "Pour",
        });
    });

    it("compte 0 quand l'agrégat du groupe est absent, et retombe sur le code sans libellé", () => {
        const dto = mapScrutinGroupeVoteEntityToDTO({
            ...baseEntity, groupe_label: null, pour: null, contre: null, abstentions: null, non_votants: null,
        });

        expect(dto).toMatchObject({ groupeLabel: "RN", pour: 0, contre: 0, abstentions: 0, nonVotants: 0 });
    });

    it("n'invente pas de position quand le groupe n'en a pas", () => {
        const dto = mapScrutinGroupeVoteEntityToDTO({ ...baseEntity, position_majoritaire: null });

        expect(dto).toMatchObject({ positionMajoritaire: null, positionMajoritaireLabel: null });
    });
});
