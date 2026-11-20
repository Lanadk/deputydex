import { mapScrutinDeputeVoteEntityToDTO } from "@/app/domains/scrutins/mappers/scrutin-depute-vote.mapper";
import { ScrutinDeputeVoteEntity } from "@/app/domains/scrutins/entities/scrutin-depute-vote.entity";

const baseEntity: ScrutinDeputeVoteEntity = {
    depute_uid: "PA793246",
    prenom: "Frédéric",
    nom: "Falcon",
    groupe_code: "RN",
    groupe_label: "Rassemblement National",
    position: "contre",
    groupe_position: "pour",
    par_delegation: null,
};

describe("mapScrutinDeputeVoteEntityToDTO", () => {
    it("signale un vote rebelle et traduit les positions", () => {
        expect(mapScrutinDeputeVoteEntityToDTO(baseEntity)).toEqual({
            deputeUid: "PA793246",
            nomComplet: "Frédéric Falcon",
            nom: "Falcon",
            groupeCode: "RN",
            groupeLabel: "Rassemblement National",
            position: "contre",
            positionLabel: "Contre",
            groupePosition: "pour",
            groupePositionLabel: "Pour",
            isRebelle: true,
            parDelegation: false,
        });
    });

    it("garde le vote par délégation", () => {
        expect(mapScrutinDeputeVoteEntityToDTO({ ...baseEntity, par_delegation: true }).parDelegation).toBe(true);
    });

    it("retombe sur l'uid quand le nom est inconnu, et sur le code quand le libellé du groupe l'est", () => {
        const dto = mapScrutinDeputeVoteEntityToDTO({ ...baseEntity, prenom: null, nom: null, groupe_label: null });
        expect(dto.nomComplet).toBe("PA793246");
        expect(dto.groupeLabel).toBe("RN");
    });
});
