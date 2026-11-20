import { mapScrutinDetailEntityToDTO } from "@/app/domains/scrutins/mappers/scrutin-detail.mapper";
import { ScrutinDetailEntity } from "@/app/domains/scrutins/entities/scrutin-detail.entity";

const baseEntity: ScrutinDetailEntity = {
    uid: "VTANR5L17V10033",
    numero: "10033",
    legislature: 17,
    date_scrutin: new Date("2026-11-19T00:00:00.000Z"),
    titre: "l'ensemble de la proposition de loi visant à pérenniser l'expérimentation « territoires zéro chômeur ».",
    type_scrutin_code: "SPO",
    type_scrutin_libelle: "scrutin public ordinaire",
    type_majorite: "Majorité absolue des suffrages exprimés",
    resultat_code: "adopté",
    resultat_libelle: "l'Assemblée nationale a adopté",
    nombre_votants: 261,
    suffrages_exprimes: 261,
    suffrages_requis: 131,
    total_pour: 258,
    total_contre: 3,
    total_abstentions: 0,
    total_non_votants: 1,
};

describe("mapScrutinDetailEntityToDTO", () => {
    it("expose le résultat, les totaux et le lien AN", () => {
        expect(mapScrutinDetailEntityToDTO(baseEntity)).toEqual({
            uid: "VTANR5L17V10033",
            numero: "10033",
            legislature: 17,
            titre: baseEntity.titre,
            date: "2026-11-19T00:00:00.000Z",
            type: { code: "SPO", libelle: "scrutin public ordinaire" },
            typeMajorite: "Majorité absolue des suffrages exprimés",
            resultat: { isAdopte: true, libelle: "Adopté" },
            totaux: { votants: 261, exprimes: 261, requis: 131, pour: 258, contre: 3, abstentions: 0, nonVotants: 1 },
            lienAN: "https://www.assemblee-nationale.fr/dyn/17/scrutins/10033",
        });
    });

    it("marque un scrutin rejeté", () => {
        const dto = mapScrutinDetailEntityToDTO({ ...baseEntity, resultat_code: "rejeté" });
        expect(dto.resultat).toEqual({ isAdopte: false, libelle: "Rejeté" });
    });

    it("n'invente ni résultat ni lien quand l'open data ne les donne pas", () => {
        const dto = mapScrutinDetailEntityToDTO({ ...baseEntity, resultat_code: null, numero: null, date_scrutin: null });
        expect(dto.resultat).toEqual({ isAdopte: false, libelle: null });
        expect(dto.lienAN).toBeNull();
        expect(dto.date).toBeNull();
    });
});
