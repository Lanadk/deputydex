import { mapScrutinListItemEntityToDTO } from "@/app/domains/scrutins/mappers/scrutin-list-item.mapper";
import { ScrutinListItemEntity } from "@/app/domains/scrutins/entities/scrutin-list-item.entity";

const baseEntity: ScrutinListItemEntity = {
    uid: "VTANR5L17V9916",
    numero: "9916",
    date_scrutin: new Date("2026-10-14T00:00:00.000Z"),
    titre: "l'ensemble du projet de loi de finances pour 2027",
    type_scrutin_code: "SPS",
    type_scrutin_libelle: "scrutin public solennel",
    resultat_code: "adopté",
    objet: "ensemble",
    total_pour: 290,
    total_contre: 250,
    total_abstentions: 12,
};

describe("mapScrutinListItemEntityToDTO", () => {
    it("expose le type avec le libellé brut de l'open data, le résultat et l'objet", () => {
        expect(mapScrutinListItemEntityToDTO(baseEntity)).toEqual({
            uid: "VTANR5L17V9916",
            numero: "9916",
            date: "2026-10-14T00:00:00.000Z",
            titre: "l'ensemble du projet de loi de finances pour 2027",
            type: { code: "SPS", libelle: "scrutin public solennel" },
            resultat: { isAdopte: true, libelle: "Adopté" },
            objet: { code: "ensemble", libelle: "Ensemble du texte" },
            pour: 290,
            contre: 250,
            abstentions: 12,
        });
    });

    it("marque un scrutin rejeté et garde un objet inconnu tel quel", () => {
        const dto = mapScrutinListItemEntityToDTO({ ...baseEntity, resultat_code: "rejeté", objet: "nouveau" });

        expect(dto.resultat).toEqual({ isAdopte: false, libelle: "Rejeté" });
        expect(dto.objet).toEqual({ code: "nouveau", libelle: "nouveau" });
    });

    it("garde null pour les données absentes de l'open data", () => {
        const dto = mapScrutinListItemEntityToDTO({
            ...baseEntity, date_scrutin: null, type_scrutin_libelle: null, resultat_code: null, total_pour: null,
        });

        expect(dto).toMatchObject({ date: null, type: { libelle: null }, resultat: { libelle: null }, pour: null });
    });
});
