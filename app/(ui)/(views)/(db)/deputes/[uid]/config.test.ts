import { DEPUTE_SECTIONS } from "@/app/(ui)/(views)/(db)/deputes/[uid]/config";
import { ExpandableCardListConfig } from "@/app/(ui)/component-library/template/sections/block-section/expandable-card-list-config.types";
import { DeputeDossierContributionDTO } from "@/app/domains/deputes/dto/depute-dossier-contribution.dto";
import { DeputeDossierAmendementDTO } from "@/app/domains/deputes/dto/depute-dossier-amendement.dto";

const CONTRIBUTION: DeputeDossierContributionDTO = {
    dossierUid: "DLR5L17N50198",
    titre: "Projet de loi de finances pour 2025",
    procedure: "Projet de loi de finances de l'année",
    nbDeposes: 65,
    nbAdoptes: 15,
    nbCosignes: 2375,
    isAuteurTexte: false,
    isCosignataireTexte: false,
    rapporteurs: [{ type: "rapporteur pour avis", etape: "1ère lecture AN" }],
    derniereActivite: "2024-11-12T00:00:00.000Z",
    lienAN: "https://www.assemblee-nationale.fr/dyn/17/dossiers/DLR5L17N50198",
};

const AMENDEMENT: DeputeDossierAmendementDTO = {
    uid: "AMANR5L17PO59048B0324P0D1N000012",
    numero: "I-12",
    division: "Article 3",
    statut: "Adopté",
    isAdopte: true,
    dateDepot: "2024-10-15T00:00:00.000Z",
    exposeSommaire: "Cet amendement vise à…",
    lienAN: "https://www.assemblee-nationale.fr/dyn/17/amendements/AMANR5L17PO59048B0324P0D1N000012",
    texte: { uid: "PRJLANR5L17B0324", libelle: "Projet de loi n° 324 · 1ère lecture AN" },
};

function mockFetchJson(body: unknown) {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => body });
    global.fetch = fetchMock as unknown as typeof fetch;
    return fetchMock;
}

const section = () => {
    const found = DEPUTE_SECTIONS.find((s) => s.id === "dossiers-legislatifs");
    if (!found) throw new Error("section dossiers-legislatifs absente");
    return found;
};

const listConfig = () => {
    const block = section().blocks.find((b) => b.type === "expandable-card-list");
    if (!block || block.type !== "expandable-card-list") throw new Error("bloc expandable-card-list absent");
    return block.config as ExpandableCardListConfig<DeputeDossierContributionDTO>;
};

const hideCosignaturesOnly = () => {
    const toggle = listConfig().toggles?.find((t) => t.label === "Masquer les co-signatures seules");
    if (!toggle) throw new Error("filtre co-signatures absent");
    return toggle;
};

describe("Fiche député — section Dossiers législatifs", () => {
    it("loads the deputy's dossier contributions for the selected legislature", async () => {
        const fetchMock = mockFetchJson([CONTRIBUTION]);

        const dataMap = await section().gatewayFn!({ uid: "PA842029", legislature: 17 });

        expect(fetchMock).toHaveBeenCalledWith("/api/deputes/PA842029/dossiers/17");
        expect(dataMap[listConfig().id]).toEqual([CONTRIBUTION]);
    });

    it("summarises a dossier card with its procedure, counters and the rapporteur's étape", () => {
        const card = listConfig().toCard(CONTRIBUTION);

        expect(card).toMatchObject({
            title: "Projet de loi de finances pour 2025",
            href: "https://www.assemblee-nationale.fr/dyn/17/dossiers/DLR5L17N50198",
            subtitle: "Projet de loi de finances de l'année",
            badges: ["Rapporteur pour avis · 1ère lecture AN"],
            stats: [
                { label: "déposés", value: 65 },
                { label: "adoptés", value: 15 },
                { label: "co-signés", value: 2375 },
            ],
        });
    });

    it("badges the author of the texte, and a co-signatory of the texte otherwise", () => {
        const auteur = listConfig().toCard({ ...CONTRIBUTION, isAuteurTexte: true, isCosignataireTexte: true, rapporteurs: [] });
        const cosignataire = listConfig().toCard({ ...CONTRIBUTION, isCosignataireTexte: true, rapporteurs: [] });

        expect(auteur.badges).toEqual(["Auteur du texte"]);
        expect(cosignataire.badges).toEqual(["Co-signataire du texte"]);
    });

    it("hides, by default, dossiers where the deputy only co-signed (amendments or the texte)", () => {
        const toggle = hideCosignaturesOnly();
        const cosignOnly = { ...CONTRIBUTION, nbDeposes: 0, rapporteurs: [], isCosignataireTexte: true };

        expect(toggle.defaultChecked).toBe(true);
        expect(toggle.keep(cosignOnly)).toBe(false);
        expect(toggle.keep({ ...cosignOnly, isAuteurTexte: true })).toBe(true);
        expect(toggle.keep({ ...cosignOnly, nbDeposes: 1 })).toBe(true);
        expect(toggle.keep(CONTRIBUTION)).toBe(true);
    });

    it("loads the deputy's amendments on a dossier, grouped by texte", async () => {
        const fetchMock = mockFetchJson([AMENDEMENT]);

        const items = await listConfig().loadItems(CONTRIBUTION, { uid: "PA842029", legislature: 17 });

        expect(fetchMock).toHaveBeenCalledWith("/api/deputes/PA842029/dossiers/17/DLR5L17N50198/amendements");
        expect(items).toEqual([{
            id: "AMANR5L17PO59048B0324P0D1N000012",
            label: "n° I-12",
            group: "Projet de loi n° 324 · 1ère lecture AN",
            context: "Article 3",
            status: "Adopté",
            tone: "success",
            date: "15/10/2024",
            summary: "Cet amendement vise à…",
            href: "https://www.assemblee-nationale.fr/dyn/17/amendements/AMANR5L17PO59048B0324P0D1N000012",
        }]);
    });

    it("counts dossiers in its own words", () => {
        expect(listConfig().countLabel?.(12)).toBe("12 dossier(s)");
    });

    it("still lets the deputy page render when the dossiers cannot be loaded", async () => {
        global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) }) as unknown as typeof fetch;
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

        const dataMap = await section().gatewayFn!({ uid: "PA842029", legislature: 17 });

        expect(dataMap[listConfig().id]).toEqual([]);
        consoleError.mockRestore();
    });
});
