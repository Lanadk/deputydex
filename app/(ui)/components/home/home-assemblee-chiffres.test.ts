import { chiffresAssemblee } from "@/app/(ui)/components/home/home-assemblee-chiffres";
import { LegislatureChiffresDTO } from "@/app/domains/legislatures/dto/legislature-chiffres.dto";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";

const CHIFFRES: LegislatureChiffresDTO = {
    legislature: 17, debut: "2024-07-18", fin: null, dureeJours: 858,
    scrutins: 10234, deputesAyantSiege: 612, gouvernements: 4, entreesEnCours: 35, entreesParMotif: [],
};

const groupe = (code: string, membres: number): GroupeCardDTO => ({
    groupeId: code, groupeCode: code, groupeLabel: code, groupePresidentFullName: "", groupeQualitySexLabel: "",
    groupeCountMembers: membres, groupeHref: `/groupes/${code}`,
});

describe("chiffresAssemblee", () => {
    it("un chiffre par rubrique : sièges occupés = somme des effectifs, groupes non vides", () => {
        const chiffres = chiffresAssemblee(CHIFFRES, [groupe("RN", 123), groupe("EPR", 92), groupe("VIDE", 0)]);

        expect(chiffres.map((c) => [c.valeur, c.libelle, c.href ?? null])).toEqual([
            [612, "députés ont siégé", "/deputydex"],
            [215, "sièges occupés", "/hemicycle"],
            [2, "groupes politiques", "/groupes"],
            [10234, "scrutins publics", "/scrutins"],
            [4, "gouvernements", "/legislatures"],
            [858, "jours depuis le début", null],
        ]);
    });

    it("chaque rubrique n'est liée qu'une fois", () => {
        const liens = chiffresAssemblee(CHIFFRES, [groupe("RN", 123)]).map((c) => c.href).filter(Boolean);

        expect(new Set(liens).size).toBe(liens.length);
    });

    it("sans groupes chargés : ni sièges occupés ni groupes", () => {
        const libelles = chiffresAssemblee({ ...CHIFFRES, gouvernements: 1, fin: "2024-06-09" }, []).map((c) => c.libelle);

        expect(libelles).toEqual(["députés ont siégé", "scrutins publics", "gouvernement", "jours de législature"]);
    });
});
