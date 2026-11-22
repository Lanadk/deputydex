import {
    chevauche,
    contient,
    exerceePendantLaSession,
    finParDissolution,
    joursEntre,
    libelleLegislature,
    libelleMandat,
    libelleSession,
    nommerGouvernements,
    sessionsDeLaLegislature,
} from "@/app/domains/legislatures/institutions";

describe("sessionsDeLaLegislature", () => {
    it("installation de juillet rattachée à la session d'octobre qui suit ; dernière session en cours", () => {
        expect(sessionsDeLaLegislature("2024-07-18", null, "2026-11-22")).toEqual([
            { annee: 2024, debut: "2024-07-18", fin: "2025-09-30", renouvellement: false },
            { annee: 2025, debut: "2025-10-01", fin: "2026-09-30", renouvellement: true },
            { annee: 2026, debut: "2026-10-01", fin: null, renouvellement: true },
        ]);
    });

    it("législature close : la dernière session finit avec elle", () => {
        expect(sessionsDeLaLegislature("2022-06-28", "2024-06-09", "2026-11-22").map((s) => [s.annee, s.debut, s.fin])).toEqual([
            [2022, "2022-06-28", "2023-09-30"],
            [2023, "2023-10-01", "2024-06-09"],
        ]);
    });

    it("installation loin d'octobre (après une dissolution en hiver) : une session à part", () => {
        expect(sessionsDeLaLegislature("2028-01-15", null, "2028-11-01").map((s) => [s.annee, s.debut, s.fin])).toEqual([
            [2027, "2028-01-15", "2028-09-30"],
            [2028, "2028-10-01", null],
        ]);
    });

    it("libelleSession", () => {
        expect(libelleSession(2025)).toBe("Session 2025-2026");
    });
});

describe("exerceePendantLaSession", () => {
    const [installation, renouvelee] = sessionsDeLaLegislature("2024-07-18", null, "2026-11-22");

    it("un mandat clos par le renouvellement d'ouverture n'appartient qu'à la session précédente", () => {
        const sortant = { debut: "2024-07-20", fin: "2025-10-01" };
        expect(exerceePendantLaSession(sortant, installation, "2026-11-22")).toBe(true);
        expect(exerceePendantLaSession(sortant, renouvelee, "2026-11-22")).toBe(false);
    });

    it("un départ en cours de session (au-delà du délai de renouvellement) y figure", () => {
        expect(exerceePendantLaSession({ debut: "2025-10-02", fin: "2025-11-04" }, renouvelee, "2026-11-22")).toBe(true);
    });

    it("pas de délai à l'installation : un mandat bref en début de législature compte", () => {
        expect(exerceePendantLaSession({ debut: "2024-07-20", fin: "2024-07-24" }, installation, "2026-11-22")).toBe(true);
    });

    it("un mandat commencé après la session n'y figure pas", () => {
        expect(exerceePendantLaSession({ debut: "2025-10-02", fin: null }, installation, "2026-11-22")).toBe(false);
    });
});

describe("institutions — règles de dates", () => {
    it("chevauche : une période en cours (fin null) chevauche tout ce qui suit son début", () => {
        expect(chevauche("2024-07-18", null, "2025-01-01", "2026-01-01")).toBe(true);
        expect(chevauche("2022-05-17", "2024-01-08", "2022-06-28", "2024-06-09")).toBe(true);
        expect(chevauche("2024-09-05", "2024-12-12", "2022-06-28", "2024-06-09")).toBe(false);
    });

    it("contient : bornes incluses", () => {
        expect(contient("2024-01-09", "2024-09-04", "2024-09-04")).toBe(true);
        expect(contient("2024-01-09", "2024-09-04", "2024-09-05")).toBe(false);
        expect(contient("2024-01-09", null, "2030-01-01")).toBe(true);
    });

    it("joursEntre : nombre de jours entre deux dates", () => {
        expect(joursEntre("2022-06-28", "2024-06-09")).toBe(712);
        expect(joursEntre("2025-09-09", "2025-10-09")).toBe(30);
    });

    it("libelleLegislature : ordinal", () => {
        expect(libelleLegislature(17)).toBe("17ᵉ législature");
        expect(libelleLegislature(1)).toBe("1ʳᵉ législature");
    });

    it("libelleMandat : 1er, 2e", () => {
        expect(libelleMandat(1)).toBe("1er mandat");
        expect(libelleMandat(2)).toBe("2e mandat");
    });
});

describe("finParDissolution", () => {
    const EVENEMENTS = [
        { date: "2022-06-19", type: "elections_legislatives" },
        { date: "2024-06-09", type: "dissolution" },
    ];

    it("vraie si une dissolution tombe dans la période (le dernier jour compris)", () => {
        expect(finParDissolution({ debut: "2022-06-28", fin: "2024-06-09" }, EVENEMENTS)).toBe(true);
    });

    it("fausse pour une législature en cours, ou close sans dissolution", () => {
        expect(finParDissolution({ debut: "2024-07-18", fin: null }, EVENEMENTS)).toBe(false);
        expect(finParDissolution({ debut: "2017-06-21", fin: "2022-06-21" }, EVENEMENTS)).toBe(false);
    });

    it("ignore les autres types d'événements", () => {
        expect(finParDissolution({ debut: "2022-06-01", fin: "2022-06-30" }, EVENEMENTS)).toBe(false);
    });
});

describe("nommerGouvernements", () => {
    const pm = (acteur_uid: string, nom: string) => ({ acteur_uid, nom });

    it("nomme chaque gouvernement d'après son Premier ministre", () => {
        expect(nommerGouvernements([pm("PA1", "Borne"), pm("PA2", "Attal")]).map((g) => g.libelle))
            .toEqual(["Gouvernement Borne", "Gouvernement Attal"]);
    });

    it("numérote les gouvernements consécutifs d'un même Premier ministre", () => {
        expect(nommerGouvernements([pm("PA3", "Bayrou"), pm("PA4", "Lecornu"), pm("PA4", "Lecornu")]).map((g) => g.libelle))
            .toEqual(["Gouvernement Bayrou", "Gouvernement Lecornu I", "Gouvernement Lecornu II"]);
    });

    it("ne numérote pas deux gouvernements non consécutifs d'un même Premier ministre ensemble", () => {
        expect(nommerGouvernements([pm("PA1", "Martin"), pm("PA2", "Durand"), pm("PA1", "Martin")]).map((g) => g.libelle))
            .toEqual(["Gouvernement Martin", "Gouvernement Durand", "Gouvernement Martin"]);
    });
});
