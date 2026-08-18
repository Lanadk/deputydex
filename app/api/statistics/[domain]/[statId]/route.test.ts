/**
 * @jest-environment node
 */

jest.mock("@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository", () => ({
    prismaActeursStatsRepository: { getAgeDistribution: jest.fn() },
}));
// `route.ts` -> `stat-handlers.registry.ts` importe SANS condition les
// handlers des 5 domaines (voir stat-handlers.registry.ts), qui importent
// chacun leur repository Prisma réel au chargement du module — même si ce
// fichier ne teste que le domaine "acteurs". Sans ces mocks, charger ce test
// force la résolution du client Prisma généré (`../generated/prisma`,
// gitignored) même quand il n'a jamais été généré (`prisma generate`) —
// exactement ce qui casse la CI sur un checkout propre (le job `test` ne
// génère pas le client, seul `build` le fait). Les autres domaines n'ont pas
// besoin d'être exercés ici, juste de ne jamais toucher au vrai module.
jest.mock("@/app/infrastructure/groupes/repositories/prisma-groupes-stats.repository", () => ({
    prismaGroupesStatsRepository: {},
}));
jest.mock("@/app/infrastructure/votes/repositories/prisma-votes-stats.repository", () => ({
    prismaVotesStatsRepository: {},
}));
jest.mock("@/app/infrastructure/scrutins/repositories/prisma-scrutins-stats.repository", () => ({
    prismaScrutinsStatsRepository: {},
}));
jest.mock("@/app/infrastructure/legislatures/repositories/prisma-legislatures-stats.repository", () => ({
    prismaLegislaturesStatsRepository: {},
}));

import { GET } from "@/app/api/statistics/[domain]/[statId]/route";
import { prismaActeursStatsRepository } from "@/app/infrastructure/acteurs/repositories/prisma-acteurs-stats.repository";

const getAgeDistribution = prismaActeursStatsRepository.getAgeDistribution as jest.Mock;

function call(domain: string, statId: string, search = "") {
    return GET(new Request(`http://localhost${search}`), { params: Promise.resolve({ domain, statId }) });
}

describe("GET /api/statistics/[domain]/[statId]", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns 200 with the RawStatData for a known stat", async () => {
        getAgeDistribution.mockResolvedValue([{ tranche_age: "<30", nb_acteurs: 12 }]);

        const res = await call("acteurs", "age-distribution");

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            shape: "distribution",
            items: [{ label: "<30", value: 12 }],
        });
    });

    it("returns 404 for an unknown domain", async () => {
        const res = await call("unknown-domain", "age-distribution");

        expect(res.status).toBe(404);
    });

    it("returns 404 for an unknown statId within a known domain", async () => {
        const res = await call("acteurs", "unknown-stat");

        expect(res.status).toBe(404);
    });

    it("returns 500 when the repository throws", async () => {
        getAgeDistribution.mockRejectedValue(new Error("DB down"));

        const res = await call("acteurs", "age-distribution");

        expect(res.status).toBe(500);
    });
});
