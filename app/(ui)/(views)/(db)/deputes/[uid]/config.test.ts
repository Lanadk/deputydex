import { DEPUTE_SECTIONS } from "@/app/(ui)/(views)/(db)/deputes/[uid]/config";
import { DossierListConfig } from "@/app/(ui)/component-library/template/sections/block-section/dossier-list-config.types";
import { DeputeDossierContributionDTO } from "@/app/domains/deputes/dto/depute-dossier-contribution.dto";
import { DeputeDossierAmendementDTO } from "@/app/domains/deputes/dto/depute-dossier-amendement.dto";

const CONTRIBUTION: DeputeDossierContributionDTO = {
    dossierUid: "DLR5L17N50198",
    titre: "Projet de loi de finances pour 2025",
    procedure: "Projet de loi de finances de l'année",
    nbDeposes: 65,
    nbAdoptes: 15,
    nbCosignes: 2375,
    isInitiateur: false,
    rolesRapporteur: ["rapporteur pour avis"],
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
    const block = section().blocks.find((b) => b.type === "dossier-list");
    if (!block || block.type !== "dossier-list") throw new Error("bloc dossier-list absent");
    return block.config as DossierListConfig<DeputeDossierContributionDTO>;
};

describe("Fiche député — section Dossiers législatifs", () => {
    it("loads the deputy's dossier contributions for the selected legislature", async () => {
        const fetchMock = mockFetchJson([CONTRIBUTION]);

        const dataMap = await section().gatewayFn!({ uid: "PA842029", legislature: 17 });

        expect(fetchMock).toHaveBeenCalledWith("/api/deputes/PA842029/dossiers/17");
        expect(dataMap[listConfig().id]).toEqual([CONTRIBUTION]);
    });

    it("summarises a dossier card with its roles and counters", () => {
        const card = listConfig().toCard(CONTRIBUTION);

        expect(card).toMatchObject({
            title: "Projet de loi de finances pour 2025",
            href: "https://www.assemblee-nationale.fr/dyn/17/dossiers/DLR5L17N50198",
            subtitle: "Projet de loi de finances de l'année",
            badges: ["Rapporteur pour avis"],
            stats: [
                { label: "déposés", value: 65 },
                { label: "adoptés", value: 15 },
                { label: "co-signés", value: 2375 },
            ],
        });
    });

    it("badges the deputy as author of the text when they initiated it", () => {
        const card = listConfig().toCard({ ...CONTRIBUTION, isInitiateur: true, rolesRapporteur: [] });
        expect(card.badges).toEqual(["Auteur du texte"]);
    });

    it("loads the deputy's amendments on a dossier as card items", async () => {
        const fetchMock = mockFetchJson([AMENDEMENT]);

        const items = await listConfig().loadItems(CONTRIBUTION, { uid: "PA842029", legislature: 17 });

        expect(fetchMock).toHaveBeenCalledWith("/api/deputes/PA842029/dossiers/17/DLR5L17N50198/amendements");
        expect(items).toEqual([{
            id: "AMANR5L17PO59048B0324P0D1N000012",
            label: "n° I-12",
            context: "Article 3",
            status: "Adopté",
            tone: "success",
            date: "15/10/2024",
            summary: "Cet amendement vise à…",
            href: "https://www.assemblee-nationale.fr/dyn/17/amendements/AMANR5L17PO59048B0324P0D1N000012",
        }]);
    });
});
