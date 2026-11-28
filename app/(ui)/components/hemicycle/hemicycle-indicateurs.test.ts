import {
    assignerDeputes,
    bornesTranches,
    COULEUR_SANS_DONNEE,
    COULEURS_TRANCHES,
    habillerSieges,
    INDICATEURS_HEMICYCLE,
    majoriteAbsolue,
    quartiles,
    trancheDe,
} from "@/app/(ui)/components/hemicycle/hemicycle-indicateurs";
import { computeHemicycleSeats } from "@/app/(ui)/components/hemicycle/hemicycle-seats";
import { HemicycleGroupe, HemicyclePerchoir } from "@/app/(ui)/_shared/adapter/hemicycle.adapter";
import { DeputesCardDTO } from "@/app/domains/deputes/dto/deputes-card.dto";
import { DeputeIndicateursDTO } from "@/app/domains/presence/dto/depute-indicateurs.dto";

const carte = (uid: string, nom: string, groupe: string): DeputesCardDTO => ({
    deputeUID: uid, deputeFullName: nom, deputeGroupeCode: groupe, deputeImage: "",
});
const groupe = (code: string, membres: DeputesCardDTO[]): HemicycleGroupe => ({
    code, shortLabel: code, label: code, count: membres.length, membres,
    presidence: null, presidentFullName: null, president: null, presidentRole: null,
});
const indic = (uid: string, tauxPresence: number | null, joursAttendus: number | null = 100): DeputeIndicateursDTO => ({
    uid, joursAttendus, tauxPresence, tauxPresenceSeance: null, tauxPresenceCommission: null, tauxParticipationScrutins: null,
});
const PRESENCE = INDICATEURS_HEMICYCLE.find((i) => i.id === "presence")!;

const A = carte("PA_A", "Alice", "G1");
const B = carte("PA_B", "Bruno", "G1");
const C = carte("PA_C", "Chloé", "G2");
const D = carte("PA_D", "David", "G2");
const GROUPES = [groupe("G1", [B, A]), groupe("G2", [D, C])];

describe("quartiles / trancheDe", () => {
    it("interpole comme percentile_cont", () => {
        expect(quartiles([10, 20, 30, 40, 50])).toEqual({ q1: 20, mediane: 30, q3: 40 });
        expect(quartiles([1, 2, 3, 4])).toEqual({ q1: 1.75, mediane: 2.5, q3: 3.25 });
        expect(quartiles([])).toBeNull();
    });

    it("range une valeur dans sa tranche (bornes basses incluses)", () => {
        const q = { q1: 20, mediane: 30, q3: 40 };
        expect([45, 40, 35, 30, 25, 20, 5].map((v) => trancheDe(v, q))).toEqual([3, 3, 2, 2, 1, 1, 0]);
    });

    it("libelle les bornes de chaque tranche", () => {
        expect(bornesTranches({ q1: 47.2, mediane: 57, q3: 65.5 })).toEqual({
            3: "≥ 65,5 %", 2: "57,0 % – 65,5 %", 1: "47,2 % – 57,0 %", 0: "< 47,2 %",
        });
    });
});

describe("assignerDeputes", () => {
    const seats = computeHemicycleSeats(GROUPES);
    const nomsParSiege = (m: Map<number, DeputesCardDTO>) => seats.map((s) => m.get(s.index)?.deputeFullName);

    it("sans indicateur : un député par siège, par nom dans chaque groupe", () => {
        expect(nomsParSiege(assignerDeputes(seats, GROUPES, null))).toEqual(["Alice", "Bruno", "Chloé", "David"]);
    });

    it("avec indicateur : valeur décroissante, sans valeur en dernier", () => {
        const valeurs: Record<string, number | null> = { PA_A: 40, PA_B: 70, PA_C: null, PA_D: 10 };
        expect(nomsParSiege(assignerDeputes(seats, GROUPES, null, (uid) => valeurs[uid]))).toEqual(["Bruno", "Alice", "David", "Chloé"]);
    });

    it("la présidence siège au perchoir, retirée des rangées de son groupe", () => {
        const perchoir: HemicyclePerchoir = {
            presidence: { uid: "PA_C", nom: "Chloé", depuis: "2024-07-18", jusqua: null },
            carte: C,
            groupeCode: "G2",
        };
        const avecPerchoir = computeHemicycleSeats(GROUPES, { groupeCode: "G2" });
        const m = assignerDeputes(avecPerchoir, GROUPES, perchoir);

        expect(m.get(avecPerchoir.find((s) => s.perchoir)!.index)).toBe(C);
        expect(avecPerchoir.filter((s) => !s.perchoir).map((s) => m.get(s.index)?.deputeFullName)).toEqual(["Alice", "Bruno", "David"]);
    });
});

describe("habillerSieges", () => {
    const assignation = new Map([[0, A], [1, B], [2, C], [3, D]]);

    it("sans indicateur : nom et sigle, couleur du groupe", () => {
        const { habillage, echelle } = habillerSieges(assignation, GROUPES, null, null);
        expect(habillage.get(0)).toEqual({ title: "Alice · G1" });
        expect(echelle).toBeNull();
    });

    it("avec indicateur : couleur de quartile, sans donnée en gris, peu de jours signalé", () => {
        const indicateurs = new Map([indic("PA_A", 80), indic("PA_B", 50, 12), indic("PA_C", 20), indic("PA_D", null)].map((i) => [i.uid, i]));
        const { habillage, echelle } = habillerSieges(assignation, GROUPES, PRESENCE, indicateurs);

        expect(echelle).toEqual({ quartiles: { q1: 35, mediane: 50, q3: 65 }, comptes: { 3: 1, 2: 1, 1: 0, 0: 1 }, sansDonnee: 1, peuFiables: 1 });
        expect(habillage.get(0)).toEqual({ background: COULEURS_TRANCHES[3], title: "Alice · G1\nTaux de présence : 80,0 % (sur 100 jours attendus)", peuFiable: false });
        expect(habillage.get(1)?.peuFiable).toBe(true);
        expect(habillage.get(3)).toEqual({ background: COULEUR_SANS_DONNEE, title: "David · G2\nTaux de présence : pas de donnée" });
    });
});

describe("majoriteAbsolue", () => {
    it("moitié des sièges pourvus, plus un", () => {
        expect(majoriteAbsolue(577)).toBe(289);
        expect(majoriteAbsolue(576)).toBe(289);
        expect(majoriteAbsolue(3)).toBe(2);
    });
});
