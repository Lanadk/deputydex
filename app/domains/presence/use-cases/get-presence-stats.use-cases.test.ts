import { IPresenceStatsRepository } from "@/app/domains/presence/repositories/IPresenceStatsRepository";
import {
    getAssembleePresenceComposantesUseCase,
    getAssembleePresenceDeputesPresentsUseCase,
    getAssembleePresenceJournaliereUseCase,
    getAssembleePresenceTauxAnnuelUseCase,
    getAssembleePresenceJourSemaineUseCase,
    getAssembleePresenceParLegislatureUseCase,
    getDeputePresenceAnnuelleUseCase,
    getDeputePresenceEvolutionUseCase,
    getGroupesPresenceAnnuelleUseCase,
    getGroupesPresenceComposantesUseCase,
    getGroupesPresenceComposanteUseCase,
    getGroupesPresenceEvolutionUseCase,
    getGroupesPresenceUseCase,
    sortParValeurDecroissante,
} from "@/app/domains/presence/use-cases/get-presence-stats.use-cases";

function makeRepository(overrides: Partial<IPresenceStatsRepository> = {}): IPresenceStatsRepository {
    return {
        getDeputeParLegislature: jest.fn().mockResolvedValue([]),
        getDeputeMensuelle: jest.fn().mockResolvedValue([]),
        getDeputeAnnuelle: jest.fn().mockResolvedValue([]),
        getGroupes: jest.fn().mockResolvedValue([]),
        getGroupesMensuelle: jest.fn().mockResolvedValue([]),
        getGroupeMensuelle: jest.fn().mockResolvedValue([]),
        getGroupesAnnuelle: jest.fn().mockResolvedValue([]),
        getAssemblee: jest.fn().mockResolvedValue([]),
        getAssembleeMensuelle: jest.fn().mockResolvedValue([]),
        getAssembleeAnnuelle: jest.fn().mockResolvedValue([]),
        getAssembleeJournaliere: jest.fn().mockResolvedValue([]),
        getAssembleeJourSemaine: jest.fn().mockResolvedValue([]),
        ...overrides,
    };
}

const assemblee = (legislature: number, taux: number | null) => ({
    legislature,
    taux_presence: taux,
    taux_presence_seance: 50.3,
    taux_presence_commission: 36.9,
    taux_excuses_commission: 12.1,
    taux_participation_scrutins: null,
    jours_presence_par_mois: 6.9,
    effectif_moyen: 260,
});

describe("présence — député", () => {
    it("évolution mensuelle : libellé AAAA-MM, ordre chronologique, mois sans jour attendu ignorés", async () => {
        const repo = makeRepository({
            getDeputeMensuelle: jest.fn().mockResolvedValue([
                { legislature: 17, mois: new Date("2025-02-01T00:00:00Z"), taux_presence: 60, jours_presence: 8 },
                { legislature: 17, mois: new Date("2024-10-01T00:00:00Z"), taux_presence: 70, jours_presence: 9 },
                { legislature: 17, mois: new Date("2024-08-01T00:00:00Z"), taux_presence: null, jours_presence: 0 },
            ]),
        });

        const result = await getDeputePresenceEvolutionUseCase(repo, "PA1");

        expect(repo.getDeputeMensuelle).toHaveBeenCalledWith("PA1");
        expect(result).toEqual({ success: true, data: { points: [{ label: "2024-10", value: 70 }, { label: "2025-02", value: 60 }] } });
    });

    it("année de mandat : libellé préfixé par la législature, ordre chronologique", async () => {
        const repo = makeRepository({
            getDeputeAnnuelle: jest.fn().mockResolvedValue([
                { legislature: 17, periode: "2", jours_presence_par_mois: 5.5, taux_presence: 50 },
                { legislature: 16, periode: "1", jours_presence_par_mois: 7.1, taux_presence: 60 },
                { legislature: 17, periode: "1", jours_presence_par_mois: 6.2, taux_presence: 55 },
            ]),
        });

        const result = await getDeputePresenceAnnuelleUseCase(repo, "PA1", "mandat");

        expect(repo.getDeputeAnnuelle).toHaveBeenCalledWith("PA1", "mandat");
        expect(result).toEqual({
            success: true,
            data: {
                items: [
                    { label: "16ᵉ · année 1", value: 7.1 },
                    { label: "17ᵉ · année 1", value: 6.2 },
                    { label: "17ᵉ · année 2", value: 5.5 },
                ],
            },
        });
    });

    it("panne du repository → DB_ERROR", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        const repo = makeRepository({ getDeputeMensuelle: jest.fn().mockRejectedValue(new Error("vue absente")) });

        expect(await getDeputePresenceEvolutionUseCase(repo, "PA1")).toEqual({ success: false, error: "DB_ERROR" });
    });
});

describe("présence — groupes", () => {
    it("classement : taux décroissant, label = CODE, taux nul exclu", async () => {
        const repo = makeRepository({
            getGroupes: jest.fn().mockResolvedValue([
                { groupe_code: "LFI", groupe_label: "LFI-NFP", taux_presence: 55.2, jours_presence_par_mois: 7 },
                { groupe_code: "RN", groupe_label: "Rassemblement National", taux_presence: 61.4, jours_presence_par_mois: 8 },
                { groupe_code: "X", groupe_label: null, taux_presence: null, jours_presence_par_mois: null },
            ]),
        });

        const result = await getGroupesPresenceUseCase(repo, 17);

        expect(repo.getGroupes).toHaveBeenCalledWith(17);
        expect(result).toEqual({ success: true, data: { items: [{ label: "RN", value: 61.4 }, { label: "LFI", value: 55.2 }] } });
    });

    it("évolution : une série par groupe, triées par nom, mois en ordre chronologique", async () => {
        const repo = makeRepository({
            getGroupesMensuelle: jest.fn().mockResolvedValue([
                { groupe_code: "RN", groupe_label: null, mois: new Date("2024-11-01T00:00:00Z"), taux_presence: 60 },
                { groupe_code: "EPR", groupe_label: null, mois: new Date("2024-10-01T00:00:00Z"), taux_presence: 50 },
                { groupe_code: "RN", groupe_label: null, mois: new Date("2024-10-01T00:00:00Z"), taux_presence: 58 },
            ]),
        });

        const result = await getGroupesPresenceEvolutionUseCase(repo, 17);

        expect(result).toEqual({
            success: true,
            data: {
                series: [
                    { name: "EPR", items: [{ label: "2024-10", value: 50 }] },
                    { name: "RN", items: [{ label: "2024-10", value: 58 }, { label: "2024-11", value: 60 }] },
                ],
            },
        });
    });

    it("année parlementaire : transmet le type au repository", async () => {
        const repo = makeRepository({
            getGroupesAnnuelle: jest.fn().mockResolvedValue([{ groupe_code: "RN", periode: "2024-2025", jours_presence_par_mois: 7.4 }]),
        });

        const result = await getGroupesPresenceAnnuelleUseCase(repo, 17, "parlementaire");

        expect(repo.getGroupesAnnuelle).toHaveBeenCalledWith(17, "parlementaire");
        expect(result).toEqual({ success: true, data: { series: [{ name: "RN", items: [{ label: "2024-2025", value: 7.4 }] }] } });
    });
});

describe("présence — Assemblée", () => {
    it("par législature : législature optionnelle transmise, ordre chronologique", async () => {
        const repo = makeRepository({ getAssemblee: jest.fn().mockResolvedValue([assemblee(17, 56.4), assemblee(16, 59.1)]) });

        const result = await getAssembleePresenceParLegislatureUseCase(repo);

        expect(repo.getAssemblee).toHaveBeenCalledWith(undefined);
        expect(result).toEqual({
            success: true,
            data: { items: [{ label: "16ᵉ législature", value: 59.1 }, { label: "17ᵉ législature", value: 56.4 }] },
        });
    });

    it("composantes : items préfixés dans l'ordre d'affichage, taux nul omis", async () => {
        const repo = makeRepository({ getAssemblee: jest.fn().mockResolvedValue([assemblee(17, 56.4)]) });

        const result = await getAssembleePresenceComposantesUseCase(repo, 17);

        expect(repo.getAssemblee).toHaveBeenCalledWith(17);
        expect(result).toEqual({
            success: true,
            data: {
                series: [
                    {
                        name: "17ᵉ législature",
                        items: [
                            { label: "1 · Présence (tous jours attendus)", value: 56.4 },
                            { label: "2 · En séance", value: 50.3 },
                            { label: "3 · En commission", value: 36.9 },
                            { label: "4 · Excusés en commission", value: 12.1 },
                        ],
                    },
                ],
            },
        });
    });

    it("jour de la semaine : lundi → dimanche quel que soit l'ordre des lignes", async () => {
        const repo = makeRepository({
            getAssembleeJourSemaine: jest.fn().mockResolvedValue([
                { legislature: 17, jour_semaine: 3, taux_presence: 73.8 },
                { legislature: 17, jour_semaine: 1, taux_presence: 41.1 },
                { legislature: 17, jour_semaine: 2, taux_presence: 67.6 },
            ]),
        });

        const result = await getAssembleePresenceJourSemaineUseCase(repo, 17);

        expect(result).toEqual({
            success: true,
            data: {
                series: [
                    {
                        name: "17ᵉ législature",
                        items: [
                            { label: "1 · Lundi", value: 41.1 },
                            { label: "2 · Mardi", value: 67.6 },
                            { label: "3 · Mercredi", value: 73.8 },
                        ],
                    },
                ],
            },
        });
    });
});

describe("présence moyenne — jour par jour et années", () => {
    const jours = [
        { jour: new Date("2025-01-15T00:00:00Z"), taux_presence_seance: 52.1, taux_presence: 61.4, deputes_presents_total: 330 },
        { jour: new Date("2025-01-14T00:00:00Z"), taux_presence_seance: 70.2, taux_presence: 75, deputes_presents_total: 420 },
    ];

    it("journalière : deux séries (séance, séance ou commission), jours en ordre chronologique", async () => {
        const repo = makeRepository({ getAssembleeJournaliere: jest.fn().mockResolvedValue(jours) });

        const result = await getAssembleePresenceJournaliereUseCase(repo, 17);

        expect(repo.getAssembleeJournaliere).toHaveBeenCalledWith(17);
        expect(result).toEqual({
            success: true,
            data: {
                series: [
                    { name: "En séance (députés en mandat)", items: [{ label: "2025-01-14", value: 70.2 }, { label: "2025-01-15", value: 52.1 }] },
                    { name: "Séance ou commission (députés attendus)", items: [{ label: "2025-01-14", value: 75 }, { label: "2025-01-15", value: 61.4 }] },
                ],
            },
        });
    });

    it("députés présents : un point par jour", async () => {
        const repo = makeRepository({ getAssembleeJournaliere: jest.fn().mockResolvedValue(jours) });

        expect(await getAssembleePresenceDeputesPresentsUseCase(repo, 17)).toEqual({
            success: true,
            data: { points: [{ label: "2025-01-14", value: 420 }, { label: "2025-01-15", value: 330 }] },
        });
    });

    it("taux par année de mandat : transmet le type, libellé « 17ᵉ · année N »", async () => {
        const repo = makeRepository({
            getAssembleeAnnuelle: jest.fn().mockResolvedValue([
                { legislature: 17, periode: "2", jours_presence_par_mois: 6.6, taux_presence: 54.6 },
                { legislature: 17, periode: "1", jours_presence_par_mois: 6.6, taux_presence: 60.1 },
            ]),
        });

        const result = await getAssembleePresenceTauxAnnuelUseCase(repo, "mandat", 17);

        expect(repo.getAssembleeAnnuelle).toHaveBeenCalledWith("mandat", 17);
        expect(result).toEqual({
            success: true,
            data: { items: [{ label: "17ᵉ · année 1", value: 60.1 }, { label: "17ᵉ · année 2", value: 54.6 }] },
        });
    });
});

describe("présence par groupe — composantes", () => {
    const groupe = (code: string, seance: number | null, commission: number | null, scrutins: number | null) => ({
        groupe_code: code,
        groupe_label: null,
        taux_presence: 50,
        taux_presence_seance: seance,
        taux_presence_commission: commission,
        taux_excuses_commission: 10,
        taux_participation_scrutins: scrutins,
        jours_presence_par_mois: 6,
    });
    const rows = [groupe("RN", 60.2, 40.1, 25.3), groupe("LFI", 71.5, null, 30.4), groupe("EPR", 55, 45.6, 18.2)];

    it("classement sur une composante : taux décroissant, groupe sans valeur exclu", async () => {
        const repo = makeRepository({ getGroupes: jest.fn().mockResolvedValue(rows) });

        expect(await getGroupesPresenceComposanteUseCase(repo, 17, "commission")).toEqual({
            success: true,
            data: { items: [{ label: "EPR", value: 45.6 }, { label: "RN", value: 40.1 }] },
        });
        expect(await getGroupesPresenceComposanteUseCase(repo, 17, "scrutins")).toEqual({
            success: true,
            data: { items: [{ label: "LFI", value: 30.4 }, { label: "RN", value: 25.3 }, { label: "EPR", value: 18.2 }] },
        });
    });

    it("toutes les composantes : une série par composante dans l'ordre d'affichage, groupes par code", async () => {
        const repo = makeRepository({ getGroupes: jest.fn().mockResolvedValue(rows) });

        const result = await getGroupesPresenceComposantesUseCase(repo, 17);

        expect(result.success && result.data.series.map((s) => s.name)).toEqual([
            "1 · En séance",
            "2 · En commission",
            "3 · Excusés en commission",
            "4 · Participation aux scrutins",
        ]);
        expect(result.success && result.data.series[0].items.map((i) => i.label)).toEqual(["EPR", "LFI", "RN"]);
    });
});

describe("sortParValeurDecroissante", () => {
    it("départage les égalités par libellé", () => {
        expect(sortParValeurDecroissante([{ label: "B", value: 5 }, { label: "A", value: 5 }, { label: "C", value: 9 }])).toEqual([
            { label: "C", value: 9 },
            { label: "A", value: 5 },
            { label: "B", value: 5 },
        ]);
    });
});
