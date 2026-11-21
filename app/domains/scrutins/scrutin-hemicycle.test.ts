import { buildScrutinHemicycle } from "@/app/domains/scrutins/scrutin-hemicycle";
import { ScrutinSiegeEntity } from "@/app/domains/scrutins/entities/scrutin-siege.entity";

function siege(place: number, uid: string, position: string | null, groupe: string | null = "SOC"): ScrutinSiegeEntity {
    return { place, depute_uid: uid, prenom: "Prénom", nom: uid, groupe_code: groupe, groupe_label: groupe ? `Groupe ${groupe}` : null, position, photo_path: null };
}

describe("buildScrutinHemicycle", () => {
    it("range les sièges de la gauche vers la droite (numéros de siège décroissants)", () => {
        const { sieges } = buildScrutinHemicycle([siege(12, "PA1", "pour"), siege(640, "PA2", "contre"), siege(300, "PA3", null)]);

        expect(sieges.map((s) => s.place)).toEqual([640, 300, 12]);
    });

    it("marque absent un député sans vote, et traduit les positions", () => {
        const { sieges } = buildScrutinHemicycle([siege(1, "PA1", null), siege(2, "PA2", "abstention"), siege(3, "PA3", "non_votant")]);

        expect(sieges.map((s) => [s.deputeUid, s.position, s.positionLabel])).toEqual([
            ["PA3", "non_votant", "Non-votant"],
            ["PA2", "abstention", "Abstention"],
            ["PA1", "absent", "Absent"],
        ]);
    });

    it("compte les sièges par position", () => {
        const { totaux } = buildScrutinHemicycle([
            siege(1, "PA1", "pour"), siege(2, "PA2", "pour"), siege(3, "PA3", "contre"), siege(4, "PA4", null),
        ]);

        expect(totaux).toEqual({ pour: 2, contre: 1, abstention: 0, non_votant: 0, absent: 1 });
    });

    it("garde un seul député par siège, en privilégiant celui qui a voté (jour de renouvellement)", () => {
        const { sieges } = buildScrutinHemicycle([siege(42, "PA1", null), siege(42, "PA2", "pour"), siege(42, "PA3", null)]);

        expect(sieges).toHaveLength(1);
        expect(sieges[0]).toMatchObject({ place: 42, deputeUid: "PA2", position: "pour" });
    });

    it("départage deux députés non votants sur le même siège par uid, quel que soit l'ordre reçu", () => {
        const a = buildScrutinHemicycle([siege(42, "PA2", null), siege(42, "PA1", null)]);
        const b = buildScrutinHemicycle([siege(42, "PA1", null), siege(42, "PA2", null)]);

        expect(a.sieges[0].deputeUid).toBe("PA1");
        expect(b.sieges[0].deputeUid).toBe("PA1");
    });

    it("compose le nom complet, et retombe sur l'uid et le code du groupe quand ils manquent", () => {
        const { sieges, groupes } = buildScrutinHemicycle([
            { place: 1, depute_uid: "PA9", prenom: null, nom: null, groupe_code: "RN", groupe_label: null, position: "pour", photo_path: null },
        ]);

        expect(sieges[0]).toMatchObject({ nomComplet: "PA9", groupeCode: "RN" });
        expect(groupes).toEqual({ RN: "RN" });
    });

    it("transmet la photo du député, ou null s'il n'en a pas", () => {
        const { sieges } = buildScrutinHemicycle([
            { ...siege(2, "PA1", "pour"), photo_path: "/tribun/17/photos/PA1.jpg" },
            siege(1, "PA2", "contre"),
        ]);

        expect(sieges.map((s) => [s.deputeUid, s.photoUrl])).toEqual([
            ["PA1", "/tribun/17/photos/PA1.jpg"],
            ["PA2", null],
        ]);
    });

    it("donne le libellé de chaque groupe une seule fois, pas sur chaque siège", () => {
        const { sieges, groupes } = buildScrutinHemicycle([
            siege(1, "PA1", "pour", "SOC"), siege(2, "PA2", "contre", "SOC"), siege(3, "PA3", null, "RN"), siege(4, "PA4", null, null),
        ]);

        expect(groupes).toEqual({ SOC: "Groupe SOC", RN: "Groupe RN" });
        expect(sieges.every((s) => !("groupeLabel" in s))).toBe(true);
    });
});
