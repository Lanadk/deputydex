/**
 * @jest-environment node
 */

const ok = <T,>(data: T) => ({ success: true as const, data });

jest.mock("@/app/domains/legislatures/use-cases/get-current-legislature.use-case", () => ({ getCurrentLegislatureUseCase: jest.fn() }));
jest.mock("@/app/domains/legislatures/use-cases/get-all-legislatures.use-case", () => ({ getAllLegislaturesUseCase: jest.fn() }));
jest.mock("@/app/domains/legislatures/use-cases/get-legislature-chiffres.use-case", () => ({ getLegislatureChiffresUseCase: jest.fn() }));
jest.mock("@/app/domains/deputes/use-cases/get-deputes-cards-sample.use-case", () => ({ getDeputesCardsSampleUseCase: jest.fn() }));
jest.mock("@/app/domains/deputes/use-cases/get-deputes-tendances.use-case", () => ({ getDeputesTendancesUseCase: jest.fn() }));
jest.mock("@/app/domains/deputes/use-cases/get-depute-vote-stats.use-case", () => ({ getDeputeVoteStatsUseCase: jest.fn() }));
jest.mock("@/app/domains/deputes/use-cases/get-depute-activity.use-case", () => ({ getDeputeActivityUseCase: jest.fn() }));
jest.mock("@/app/domains/groupes/use-cases/get-groupe-cards.use-case", () => ({ getGroupeCardsUseCase: jest.fn() }));
jest.mock("@/app/domains/scrutins/use-cases/get-scrutins-list.use-case", () => ({ getScrutinsListUseCase: jest.fn() }));
jest.mock("@/app/domains/scrutins/use-cases/get-scrutin-plus-serre.use-case", () => ({ getScrutinPlusSerreUseCase: jest.fn() }));

import { getHomeData } from "@/app/home-data";
import { getCurrentLegislatureUseCase } from "@/app/domains/legislatures/use-cases/get-current-legislature.use-case";
import { getAllLegislaturesUseCase } from "@/app/domains/legislatures/use-cases/get-all-legislatures.use-case";
import { getLegislatureChiffresUseCase } from "@/app/domains/legislatures/use-cases/get-legislature-chiffres.use-case";
import { getDeputesCardsSampleUseCase } from "@/app/domains/deputes/use-cases/get-deputes-cards-sample.use-case";
import { getDeputesTendancesUseCase } from "@/app/domains/deputes/use-cases/get-deputes-tendances.use-case";
import { getDeputeVoteStatsUseCase } from "@/app/domains/deputes/use-cases/get-depute-vote-stats.use-case";
import { getDeputeActivityUseCase } from "@/app/domains/deputes/use-cases/get-depute-activity.use-case";
import { getGroupeCardsUseCase } from "@/app/domains/groupes/use-cases/get-groupe-cards.use-case";
import { getScrutinsListUseCase } from "@/app/domains/scrutins/use-cases/get-scrutins-list.use-case";
import { getScrutinPlusSerreUseCase } from "@/app/domains/scrutins/use-cases/get-scrutin-plus-serre.use-case";

const L17 = { id: 17, number: 17, startDate: "2024-07-18", endDate: null };
const ASSIDU = { deputeUID: "PA1", deputeFullName: "Julien Guibert", deputeGroupeCode: "RN", deputeImage: "" };
const mock = (fn: unknown) => fn as jest.Mock;

describe("getHomeData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mock(getCurrentLegislatureUseCase).mockResolvedValue(ok(L17));
        mock(getAllLegislaturesUseCase).mockResolvedValue(ok([L17]));
        mock(getLegislatureChiffresUseCase).mockResolvedValue(ok({ scrutins: 10 }));
        mock(getDeputesCardsSampleUseCase).mockResolvedValue(ok([]));
        mock(getDeputesTendancesUseCase).mockResolvedValue(ok({ assidu: { depute: ASSIDU, valeur: 9 } }));
        mock(getDeputeVoteStatsUseCase).mockResolvedValue(ok({ totalVotes: 9 }));
        mock(getDeputeActivityUseCase).mockResolvedValue(ok([]));
        mock(getGroupeCardsUseCase).mockResolvedValue(ok([]));
        mock(getScrutinsListUseCase).mockResolvedValue(ok({ items: [] }));
        mock(getScrutinPlusSerreUseCase).mockResolvedValue(ok({ scrutin: null }));
    });

    it("lit tout pour la législature en cours, y compris la fiche du député le plus assidu", async () => {
        const data = await getHomeData();

        expect(data.legislature).toEqual(L17);
        expect(data.chiffres).toEqual({ scrutins: 10 });
        expect(getScrutinsListUseCase).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ legislature: 17, pageSize: 3 }));
        expect(getDeputeVoteStatsUseCase).toHaveBeenCalledWith(expect.anything(), "PA1", 17);
        expect(data.fiche).toEqual({ depute: ASSIDU, stats: { totalVotes: 9 }, activite: [] });
    });

    it("un bloc en erreur vaut null (le client le rechargera), les autres sont lus", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        mock(getLegislatureChiffresUseCase).mockResolvedValue({ success: false, error: "DB_ERROR" });
        mock(getScrutinPlusSerreUseCase).mockRejectedValue(new Error("down"));

        const data = await getHomeData();

        expect(data.chiffres).toBeNull();
        expect(data.plusSerre).toBeNull();
        expect(data.tendances).not.toBeNull();
    });

    it("sans législature en cours : rien d'autre n'est lu", async () => {
        mock(getCurrentLegislatureUseCase).mockResolvedValue({ success: false, error: "NOT_FOUND" });

        const data = await getHomeData();

        expect(data.legislature).toBeNull();
        expect(data.cards).toBeNull();
        expect(getDeputesTendancesUseCase).not.toHaveBeenCalled();
    });
});
