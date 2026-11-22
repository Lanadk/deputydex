import { getLegislatureOrganisationUseCase } from "@/app/domains/legislatures/use-cases/get-legislature-organisation.use-case";
import { fonction, makeRepository, membre, PREMIERS_MINISTRES } from "@/app/domains/legislatures/use-cases/legislature-organisation.test-helpers";

const AUJOURDHUI = "2026-11-22";

describe("getLegislatureOrganisationUseCase", () => {
    beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
    afterEach(() => jest.restoreAllMocks());

    it("NOT_FOUND pour une législature inconnue", async () => {
        const result = await getLegislatureOrganisationUseCase(makeRepository(), 99, AUJOURDHUI);

        expect(result).toEqual({ success: false, error: "NOT_FOUND" });
    });

    it("DB_ERROR si le repository échoue", async () => {
        const repository = makeRepository({ getPremiersMinistres: jest.fn().mockRejectedValue(new Error("down")) });

        expect(await getLegislatureOrganisationUseCase(repository, 17, AUJOURDHUI)).toEqual({ success: false, error: "DB_ERROR" });
    });

    it("définitions des fonctions, par clé du référentiel", async () => {
        const result = await getLegislatureOrganisationUseCase(makeRepository(), 17, AUJOURDHUI);

        if (!result.success) throw new Error("attendu : succès");
        expect(result.data.definitions).toEqual({
            "assemblee-questeur": { libelle: "Questure", definition: "Les questeurs gèrent le budget de l'Assemblée.", source: "Règlement, art. 15" },
            "ministre-delegue": { libelle: "Ministre délégué", definition: "Chargé d'une partie des attributions d'un ministre.", source: null },
        });
    });

    it("référentiel des définitions illisible : la page reste disponible, sans définitions", async () => {
        const repository = makeRepository({ getFonctionsDefinitions: jest.fn().mockRejectedValue(new Error("relation does not exist")) });

        const result = await getLegislatureOrganisationUseCase(repository, 17, AUJOURDHUI);

        if (!result.success) throw new Error("attendu : succès");
        expect(result.data.definitions).toEqual({});
        expect(result.data.gouvernements.length).toBeGreaterThan(0);
    });

    it("17ᵉ (en cours) : référence aujourd'hui, gouvernements du plus récent au plus ancien, Présidence en cours", async () => {
        const repository = makeRepository();

        const result = await getLegislatureOrganisationUseCase(repository, 17, AUJOURDHUI);

        if (!result.success) throw new Error("succès attendu");
        expect(result.data.dateReference).toBe(AUJOURDHUI);
        expect(result.data.presidence).toEqual({
            president: "Emmanuel Macron",
            mandat: "2e mandat",
            depuis: "2022-05-14",
            photoUrl: "/assets/imgs/personnalites/emmanuel-macron.jpg",
            photoCredit: { auteur: "The White House", licence: "Domaine public", licenceUrl: null },
        });
        expect(result.data.gouvernements.map((g) => g.libelle)).toEqual([
            "Gouvernement Lecornu II", "Gouvernement Lecornu I", "Gouvernement Barnier", "Gouvernement Attal",
        ]);
        // Nominations lues depuis le début du premier gouvernement de la législature (Attal).
        expect(repository.getMembresGouvernement).toHaveBeenCalledWith("2024-01-09", AUJOURDHUI);
        expect(repository.getFonctionsAssemblee).toHaveBeenCalledWith(17, AUJOURDHUI);
    });

    it("photo : celle de député sans crédit ; un portrait du référentiel avec son crédit", async () => {
        const repository = makeRepository({
            getPremiersMinistres: jest.fn().mockResolvedValue([
                { ...PREMIERS_MINISTRES[1], photo_path: "/tribun/16/attal.png" },
                {
                    ...PREMIERS_MINISTRES[2],
                    photo_path: "/assets/imgs/personnalites/michel-barnier.jpg",
                    photo_auteur: "Florian David", photo_licence: "CC BY-SA 4.0", photo_licence_url: "https://creativecommons.org/licenses/by-sa/4.0/",
                },
            ]),
        });

        const result = await getLegislatureOrganisationUseCase(repository, 17, AUJOURDHUI);

        if (!result.success) throw new Error("succès attendu");
        const [barnier, attal] = result.data.gouvernements.map((g) => g.premierMinistre);
        expect(attal).toMatchObject({ photoUrl: "/tribun/16/attal.png", photoCredit: null });
        expect(barnier).toMatchObject({
            photoUrl: "/assets/imgs/personnalites/michel-barnier.jpg",
            photoCredit: { auteur: "Florian David", licence: "CC BY-SA 4.0", licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
        });
    });

    it("pas de mandat présidentiel en cours dans le référentiel : pas de présidence", async () => {
        const repository = makeRepository({ getMandatsPresidentiels: jest.fn().mockResolvedValue([]) });

        const result = await getLegislatureOrganisationUseCase(repository, 17, AUJOURDHUI);

        if (!result.success) throw new Error("succès attendu");
        expect(result.data.presidence).toBeNull();
    });

    it("16ᵉ (close) : référence à sa date de fin, gouvernements qui l'ont chevauchée", async () => {
        const result = await getLegislatureOrganisationUseCase(makeRepository(), 16, AUJOURDHUI);

        if (!result.success) throw new Error("succès attendu");
        expect(result.data.dateReference).toBe("2024-06-09");
        expect(result.data.gouvernements.map((g) => g.libelle)).toEqual(["Gouvernement Attal", "Gouvernement Borne"]);
    });

    it("range les membres par rang et par nom ; exclut le Premier ministre et les parlementaires en mission ; signale les départs", async () => {
        const repository = makeRepository({
            getMembresGouvernement: jest.fn().mockResolvedValue([
                membre("PA_LECORNU", "Lecornu", "Premier ministre", "2025-10-10"),
                membre("PA_M1", "Vautrin", "Ministre", "2025-10-12"),
                membre("PA_M2", "Darmanin", "Garde des sceaux", "2025-10-12"),
                membre("PA_D1", "Moutchou", "Ministre délégué", "2025-10-12", "2026-03-01"),
                membre("PA_X", "Guedj", "en mission", "2026-07-06"),
                membre("PA_NON_DEPUTE", "Nunez", "Ministre", "2025-10-12", null, false),
            ]),
        });

        const result = await getLegislatureOrganisationUseCase(repository, 17, AUJOURDHUI);

        if (!result.success) throw new Error("succès attendu");
        const lecornuII = result.data.gouvernements[0];
        expect(lecornuII.premierMinistre).toMatchObject({ nom: "Sébastien Lecornu", href: "/deputes/PA_LECORNU" });
        expect(lecornuII.rangs.map((r) => [r.libelle, r.membres.map((m) => m.nom)])).toEqual([
            ["Ministres", ["P. Darmanin", "P. Nunez", "P. Vautrin"]],
            ["Ministres délégués", ["P. Moutchou"]],
        ]);
        expect(lecornuII.rangs[1].membres[0].jusqua).toBe("2026-03-01");
        expect(lecornuII.rangs[0].membres.find((m) => m.nom === "P. Nunez")?.href).toBeNull();
    });

    it("une personne une seule fois par rang (son dernier mandat), mais dans chaque rang qu'elle a occupé", async () => {
        const repository = makeRepository({
            getMembresGouvernement: jest.fn().mockResolvedValue([
                // Deux mandats consécutifs de ministre délégué (remaniement) : le dernier est en cours.
                membre("PA_V", "Vedrenne", "Ministre délégué", "2025-10-13", "2026-02-26"),
                membre("PA_V", "Vedrenne", "Ministre délégué", "2026-02-27"),
                // Promue en cours de gouvernement : un mandat dans chaque rang.
                membre("PA_R", "Roubache", "Secrétaire d'État", "2025-10-13", "2026-02-26"),
                membre("PA_R", "Roubache", "Ministre délégué", "2026-02-27"),
            ]),
        });

        const result = await getLegislatureOrganisationUseCase(repository, 17, AUJOURDHUI);

        if (!result.success) throw new Error("succès attendu");
        const rangs = result.data.gouvernements[0].rangs;
        expect(rangs.map((r) => [r.rang, r.membres.map((m) => [m.uid, m.jusqua])])).toEqual([
            ["ministre-delegue", [["PA_R", null], ["PA_V", null]]],
            ["secretaire-etat", [["PA_R", "2026-02-26"]]],
        ]);
    });

    it("Bureau sans les fonctions « d'âge » ; présidences de groupe et de commission triées", async () => {
        const repository = makeRepository({
            getFonctionsAssemblee: jest.fn().mockResolvedValue([
                fonction("PA_YBP", "Braun-Pivet", "BUREAU", "Président"),
                fonction("PA_AGE", "Gonzalez", "BUREAU", "Président d'âge"),
                fonction("PA_VP2", "Guetté", "BUREAU", "Vice-Président"),
                fonction("PA_VP1", "Chenu", "BUREAU", "Vice-Président"),
                fonction("PA_Q", "Klinkert", "BUREAU", "Questeur"),
                fonction("PA_S", "Breton", "BUREAU", "Secrétaire"),
                fonction("PA_S_AGE", "Boyard", "BUREAU", "Secrétaire d'âge"),
                fonction("PA_G2", "Panot", "GP", "Président", "PO2", { code: "LFI-NFP", libelle: "La France insoumise - NFP" }),
                fonction("PA_G1", "Attal", "GP", "Président", "PO1", { code: "EPR", libelle: "Ensemble pour la République" }),
                fonction("PA_C1", "Coquerel", "COMPER", "Président", "PO59048"),
                fonction("PA_C2", "Fuchs", "COMPER", "Président", "PO59047"),
            ]),
        });

        const result = await getLegislatureOrganisationUseCase(repository, 17, AUJOURDHUI);

        if (!result.success) throw new Error("succès attendu");
        const a = result.data.sessions[0];
        expect(a.president).toMatchObject({ nom: "P. Braun-Pivet", href: "/deputes/PA_YBP" });
        expect(a.vicePresidents.map((p) => p.nom)).toEqual(["P. Chenu", "P. Guetté"]);
        expect(a.questeurs.map((p) => p.nom)).toEqual(["P. Klinkert"]);
        expect(a.secretaires.map((p) => p.nom)).toEqual(["P. Breton"]);
        expect(a.presidentsGroupe.map((p) => p.groupeCode)).toEqual(["EPR", "LFI-NFP"]);
        expect(a.presidentsCommission.map((p) => p.commission)).toEqual([
            "Affaires étrangères",
            "Finances, économie générale et contrôle budgétaire",
        ]);
    });

    it("Assemblée par session, de la plus récente à la plus ancienne : sortants du renouvellement, départs en cours de session", async () => {
        const repository = makeRepository({
            getFonctionsAssemblee: jest.fn().mockResolvedValue([
                fonction("PA_YBP", "Braun-Pivet", "BUREAU", "Président", "PO1", null, "2024-07-18"),
                // Secrétaire sortante au renouvellement (fin le lendemain de l'ouverture) : session 2024-2025 seulement.
                fonction("PA_S1", "Sortante", "BUREAU", "Secrétaire", "PO1", null, "2024-07-20", "2025-10-01"),
                fonction("PA_S2", "Entrante", "BUREAU", "Secrétaire", "PO1", null, "2025-10-02"),
                // Vice-président parti en cours de session, puis son remplaçant.
                fonction("PA_VP1", "Parti", "BUREAU", "Vice-Président", "PO1", null, "2024-07-19", "2024-10-21"),
                fonction("PA_VP2", "Remplacant", "BUREAU", "Vice-Président", "PO1", null, "2024-10-22", "2025-09-30"),
                // Réélue sans interruption : une seule fois par session.
                fonction("PA_Q", "Reelue", "BUREAU", "Questeur", "PO1", null, "2024-07-19", "2025-09-30"),
                fonction("PA_Q", "Reelue", "BUREAU", "Questeur", "PO1", null, "2025-10-01"),
            ]),
        });

        const result = await getLegislatureOrganisationUseCase(repository, 17, AUJOURDHUI);

        if (!result.success) throw new Error("succès attendu");
        const sessions = result.data.sessions;
        expect(sessions.map((s) => [s.libelle, s.debut, s.fin])).toEqual([
            ["Session 2026-2027", "2026-10-01", null],
            ["Session 2025-2026", "2025-10-01", "2026-09-30"],
            // Installation de juillet rattachée à la session d'octobre qui suit.
            ["Session 2024-2025", "2024-07-18", "2025-09-30"],
        ]);
        const [, s2025, s2024] = sessions;
        expect(s2024.president).toMatchObject({ nom: "P. Braun-Pivet", jusqua: null });
        expect(s2024.secretaires.map((p) => [p.nom, p.jusqua])).toEqual([["P. Sortante", null]]);
        expect(s2025.secretaires.map((p) => p.nom)).toEqual(["P. Entrante"]);
        expect(s2024.vicePresidents.map((p) => [p.nom, p.jusqua])).toEqual([["P. Parti", "2024-10-21"], ["P. Remplacant", null]]);
        expect(s2025.vicePresidents).toEqual([]);
        expect(s2024.questeurs.map((p) => p.nom)).toEqual(["P. Reelue"]);
        expect(s2025.questeurs.map((p) => p.nom)).toEqual(["P. Reelue"]);
    });

    it("16ᵉ (close) : la dernière session finit avec la législature", async () => {
        const result = await getLegislatureOrganisationUseCase(makeRepository(), 16, AUJOURDHUI);

        if (!result.success) throw new Error("succès attendu");
        expect(result.data.sessions.map((s) => [s.libelle, s.debut, s.fin])).toEqual([
            ["Session 2023-2024", "2023-10-01", "2024-06-09"],
            ["Session 2022-2023", "2022-06-28", "2023-09-30"],
        ]);
    });
});
