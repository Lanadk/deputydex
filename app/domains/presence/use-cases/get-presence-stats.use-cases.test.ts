import { IPresenceStatsRepository } from "@/app/domains/presence/repositories/IPresenceStatsRepository";
import {
    getAssembleePresenceComposantesUseCase,
    getAssembleePresenceDeputesPresentsUseCase,
    getAssembleePresenceJournaliereUseCase,
    getAssembleePresenceTauxAnnuelUseCase,
    getAssembleePresenceJourSemaineUseCase,
    getAssembleePresenceParLegislatureUseCase,
    getDeputePresenceAnnuelleUseCase,
    getDeputePresenceComposantesUseCase,
    getDeputePresenceContexteUseCase,
    getDeputePresenceEvolutionUseCase,
    getGroupesPresenceAnnuelleUseCase,
    getGroupesPresenceComposantesUseCase,
    getGroupesPresenceComposanteUseCase,
    getGroupesPresenceEvolutionUseCase,
    getGroupesPresenceUseCase,
    getReperesLegislaturesUseCase,
    sortParValeurDecroissante,
} from "@/app/domains/presence/use-cases/get-presence-stats.use-cases";
import { getIndicateursDeputesUseCase } from "@/app/domains/presence/use-cases/get-indicateurs-deputes.use-case";

function makeRepository(overrides: Partial<IPresenceStatsRepository> = {}): IPresenceStatsRepository {
    return {
        getDeputeParLegislature: jest.fn().mockResolvedValue([]),
        getDeputeMensuelle: jest.fn().mockResolvedValue([]),
        getDeputeAnnuelle: jest.fn().mockResolvedValue([]),
        getDeputeDebutsMandat: jest.fn().mockResolvedValue([]),
        getIndicateursDeputes: jest.fn().mockResolvedValue([]),
        getGroupes: jest.fn().mockResolvedValue([]),
        getGroupesMensuelle: jest.fn().mockResolvedValue([]),
        getGroupeMensuelle: jest.fn().mockResolvedValue([]),
        getGroupesAnnuelle: jest.fn().mockResolvedValue([]),
        getAssemblee: jest.fn().mockResolvedValue([]),
        getAssembleeMensuelle: jest.fn().mockResolvedValue([]),
        getAssembleeAnnuelle: jest.fn().mockResolvedValue([]),
        getAssembleeJournaliere: jest.fn().mockResolvedValue([]),
        getAssembleeJourSemaine: jest.fn().mockResolvedValue([]),
        getDebutsLegislatures: jest.fn().mockResolvedValue([]),
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

        // Sans législature (mode avancé) : toutes ses législatures.
        expect(repo.getDeputeMensuelle).toHaveBeenCalledWith("PA1", undefined);
        expect(result).toEqual({ success: true, data: { points: [{ label: "2024-10", value: 70 }, { label: "2025-02", value: 60 }] } });
    });

    it("fiche député : la législature est transmise au repository", async () => {
        const repo = makeRepository();

        await getDeputePresenceEvolutionUseCase(repo, "PA1", 17);
        await getDeputePresenceComposantesUseCase(repo, "PA1", 17);
        await getDeputePresenceContexteUseCase(repo, "PA1", 17);

        expect(repo.getDeputeMensuelle).toHaveBeenCalledWith("PA1", 17);
        expect(repo.getDeputeParLegislature).toHaveBeenCalledWith("PA1", 17);
        expect(repo.getDeputeDebutsMandat).toHaveBeenCalledWith("PA1", 17);
    });

    it("composantes du député : même série que l'Assemblée (taux, séance, commission, excusés, scrutins)", async () => {
        const repo = makeRepository({
            getDeputeParLegislature: jest.fn().mockResolvedValue([
                {
                    legislature: 17, jours_attendus: 33, jours_presents: 7, taux_presence: 21.2, taux_presence_seance: 18.5,
                    taux_presence_commission: 40, taux_excuses_commission: 10, taux_participation_scrutins: null,
                    jours_presence: 7, jours_vote: 3, jours_debat: 1, jours_commission: 4, jours_presence_par_mois: 2.3,
                },
            ]),
        });

        expect(await getDeputePresenceComposantesUseCase(repo, "PA1", 17)).toEqual({
            success: true,
            data: {
                series: [
                    {
                        name: "17ᵉ législature",
                        items: [
                            { label: "1 · Présence (tous jours attendus)", value: 21.2 },
                            { label: "2 · En séance", value: 18.5 },
                            { label: "3 · En commission", value: 40 },
                            { label: "4 · Excusés en commission", value: 10 },
                        ],
                    },
                ],
            },
        });
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

        expect(repo.getDeputeAnnuelle).toHaveBeenCalledWith("PA1", "mandat", undefined);
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

    it("contexte : prise de fonction et jours attendus / présents, une mention par législature", async () => {
        const repo = makeRepository({
            getDeputeDebutsMandat: jest.fn().mockResolvedValue([
                { legislature: 17, debut_mandat: new Date("2026-07-26T00:00:00Z") },
                { legislature: 16, debut_mandat: new Date("2022-06-22T00:00:00Z") },
            ]),
            getDeputeParLegislature: jest.fn().mockResolvedValue([
                { legislature: 17, jours_attendus: 33, jours_presents: 7 },
                { legislature: 16, jours_attendus: 1, jours_presents: 1 },
            ]),
        });

        expect(await getDeputePresenceContexteUseCase(repo, "PA642734")).toEqual({
            success: true,
            data:
                "16ᵉ législature : en fonction depuis le 22/06/2022 · 1 jour attendu, 1 présent — " +
                "17ᵉ législature : en fonction depuis le 26/07/2026 · 33 jours attendus, 7 présents",
        });
    });

    it("contexte : null pour un député sans jour de mandat connu", async () => {
        expect(await getDeputePresenceContexteUseCase(makeRepository(), "PA0")).toEqual({ success: true, data: null });
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

describe("groupes et député — toutes législatures", () => {
    const groupe = (legislature: number, code: string, taux: number) => ({
        legislature, groupe_code: code, groupe_label: null, taux_presence: taux, taux_presence_seance: null,
        taux_presence_commission: null, taux_excuses_commission: null, taux_participation_scrutins: null, jours_presence_par_mois: null,
    });

    it("groupes : chaque groupe de chaque législature à part, « CODE · Nᵉ » (pas de fusion)", async () => {
        const repo = makeRepository({ getGroupes: jest.fn().mockResolvedValue([groupe(16, "RN", 60), groupe(17, "RN", 58.7), groupe(16, "LFI-NUPES", 65)]) });

        expect(await getGroupesPresenceUseCase(repo, "toutes")).toEqual({
            success: true,
            data: { items: [{ label: "LFI-NUPES · 16ᵉ", value: 65 }, { label: "RN · 16ᵉ", value: 60 }, { label: "RN · 17ᵉ", value: 58.7 }] },
        });
        expect(repo.getGroupes).toHaveBeenCalledWith("toutes");

        // Une législature précise : le sigle seul, comme avant.
        expect(await getGroupesPresenceUseCase(repo, 17)).toEqual(expect.objectContaining({ success: true }));
        expect(repo.getGroupes).toHaveBeenLastCalledWith(17);
    });

    it("groupes : évolution mensuelle, une série par groupe et par législature", async () => {
        const repo = makeRepository({
            getGroupesMensuelle: jest.fn().mockResolvedValue([
                { legislature: 16, groupe_code: "RN", groupe_label: null, mois: new Date("2024-05-01T00:00:00Z"), taux_presence: 55 },
                { legislature: 17, groupe_code: "RN", groupe_label: null, mois: new Date("2024-10-01T00:00:00Z"), taux_presence: 60 },
            ]),
        });

        const result = await getGroupesPresenceEvolutionUseCase(repo, "toutes");
        expect(result.success && result.data.series.map((s) => s.name)).toEqual(["RN · 16ᵉ", "RN · 17ᵉ"]);
    });

    it("député : « toutes » transmis au repository (lignes combinées de ses législatures)", async () => {
        const repo = makeRepository();

        await getDeputePresenceEvolutionUseCase(repo, "PA1", "toutes");
        await getDeputePresenceComposantesUseCase(repo, "PA1", "toutes");

        expect(repo.getDeputeMensuelle).toHaveBeenCalledWith("PA1", "toutes");
        expect(repo.getDeputeParLegislature).toHaveBeenCalledWith("PA1", "toutes");
    });
});

describe("présence de l'Assemblée — toutes législatures", () => {
    it("transmet le périmètre « toutes » ; une ligne null se libelle « Toutes législatures », une année sans préfixe", async () => {
        const repo = makeRepository({
            getAssemblee: jest.fn().mockResolvedValue([assemblee(16, 59.1), { ...assemblee(17, 56.4), legislature: null, taux_presence: 57.7 }]),
            getAssembleeAnnuelle: jest.fn().mockResolvedValue([
                { legislature: null, periode: "2023-2024", jours_presence_par_mois: 6.8, taux_presence: 55.5 },
                { legislature: null, periode: "2022-2023", jours_presence_par_mois: 7.2, taux_presence: 60.4 },
            ]),
        });

        const composantes = await getAssembleePresenceComposantesUseCase(repo, "toutes");
        expect(repo.getAssemblee).toHaveBeenCalledWith("toutes");
        expect(composantes.success && composantes.data.series.map((s) => s.name)).toEqual(["16ᵉ législature", "Toutes législatures"]);

        expect(await getAssembleePresenceTauxAnnuelUseCase(repo, "parlementaire", "toutes")).toEqual({
            success: true,
            data: { items: [{ label: "2022-2023", value: 60.4 }, { label: "2023-2024", value: 55.5 }] },
        });
        expect(repo.getAssembleeAnnuelle).toHaveBeenCalledWith("parlementaire", "toutes");
    });

    it("repères : début de chaque législature dans l'échelle des libellés", async () => {
        const repo = makeRepository({
            getDebutsLegislatures: jest.fn().mockResolvedValue([
                { legislature: 16, debut: new Date("2022-06-28T00:00:00Z") },
                { legislature: 17, debut: new Date("2024-07-18T00:00:00Z") },
            ]),
        });

        expect(await getReperesLegislaturesUseCase(repo, "parlementaire", ["2021-2022", "2022-2023", "2023-2024", "2024-2025"])).toEqual({
            success: true,
            data: [{ at: "2023-2024", label: "Début de la 17ᵉ législature" }],
        });
    });
});

describe("getIndicateursDeputesUseCase", () => {
    it("lit les indicateurs de la législature et les expose en camelCase", async () => {
        const repo = makeRepository({
            getIndicateursDeputes: jest.fn().mockResolvedValue([{
                acteur_uid: "PA1", jours_attendus: 120, taux_presence: 57,
                taux_presence_seance: 50.2, taux_presence_commission: null, taux_participation_scrutins: 19.1,
            }]),
        });

        expect(await getIndicateursDeputesUseCase(repo, 17)).toEqual({
            success: true,
            data: [{
                uid: "PA1", joursAttendus: 120, tauxPresence: 57,
                tauxPresenceSeance: 50.2, tauxPresenceCommission: null, tauxParticipationScrutins: 19.1,
            }],
        });
        expect(repo.getIndicateursDeputes).toHaveBeenCalledWith(17);
    });

    it("échec du dépôt : DB_ERROR", async () => {
        const repo = makeRepository({ getIndicateursDeputes: jest.fn().mockRejectedValue(new Error("down")) });
        const result = await getIndicateursDeputesUseCase(repo, 17);
        expect(result.success).toBe(false);
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
