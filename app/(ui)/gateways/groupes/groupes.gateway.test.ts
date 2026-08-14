import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";

function mockFetchOnce(response: { ok: boolean; json?: () => Promise<unknown> }) {
    global.fetch = jest.fn().mockResolvedValue({
        ok: response.ok,
        json: response.json ?? (async () => ({})),
    }) as unknown as typeof fetch;
}

describe("groupesGateways — URL construction & success path", () => {
    afterEach(() => jest.resetAllMocks());

    it.each([
        ["getGroupesCards", () => groupesGateways.getGroupesCards(17), "/api/groupes/cards/17"],
        ["getGroupeInfos", () => groupesGateways.getGroupeInfos("REN", 17), "/api/groupes/infos/REN/17"],
        ["getGroupeLegislatures", () => groupesGateways.getGroupeLegislatures("REN"), "/api/groupes/legislatures/REN"],
        ["getGroupeMembers", () => groupesGateways.getGroupeMembers("REN", 17), "/api/groupes/members/REN/17"],
        ["getGroupeComposition", () => groupesGateways.getGroupeComposition("REN", 17), "/api/groupes/composition/REN/17"],
        ["getGroupeCohesion", () => groupesGateways.getGroupeCohesion("REN", 17), "/api/groupes/cohesion/REN/17"],
        ["getGroupeComportement", () => groupesGateways.getGroupeComportement("REN", 17), "/api/groupes/comportement/REN/17"],
        ["getGroupeActivityCalendar", () => groupesGateways.getGroupeActivityCalendar("REN", 17), "/api/groupes/activity/REN/17"],
    ])("%s calls the expected URL and resolves with the parsed JSON", async (_name, call, expectedUrl) => {
        const data = { ok: "value" };
        mockFetchOnce({ ok: true, json: async () => data });

        await expect(call()).resolves.toEqual(data);
        expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });

    it("getGroupeActivityCalendarDetails appends the date as a query param", async () => {
        mockFetchOnce({ ok: true, json: async () => ({}) });

        await groupesGateways.getGroupeActivityCalendarDetails("REN", 17, "2024-07-08");

        expect(fetch).toHaveBeenCalledWith("/api/groupes/activity/REN/17/details?date=2024-07-08");
    });
});

describe("groupesGateways — error messages on a non-ok response", () => {
    afterEach(() => jest.resetAllMocks());

    it.each([
        ["getGroupesCards", () => groupesGateways.getGroupesCards(17), "Failed to get groupes cards"],
        ["getGroupeInfos", () => groupesGateways.getGroupeInfos("REN", 17), "Failed to get groupe infos"],
        ["getGroupeLegislatures", () => groupesGateways.getGroupeLegislatures("REN"), "Failed to get groupe legislatures"],
        ["getGroupeActivityCalendar", () => groupesGateways.getGroupeActivityCalendar("REN", 17), "Failed to get activity"],
        ["getGroupeActivityCalendarDetails", () => groupesGateways.getGroupeActivityCalendarDetails("REN", 17, "2024-07-08"), "Failed to get activity"],
    ])("%s throws '%s'", async (_name, call, expectedMessage) => {
        mockFetchOnce({ ok: false });
        await expect(call()).rejects.toThrow(expectedMessage as string);
    });

    // Bug de copié-collé documenté : ces 3 méthodes lèvent toutes le même
    // message "Failed to get groupe infos", hérité du premier endpoint écrit
    // dans ce fichier, plutôt qu'un message qui reflète leur propre appel.
    it.each([
        ["getGroupeMembers", () => groupesGateways.getGroupeMembers("REN", 17)],
        ["getGroupeComposition", () => groupesGateways.getGroupeComposition("REN", 17)],
        ["getGroupeCohesion", () => groupesGateways.getGroupeCohesion("REN", 17)],
        ["getGroupeComportement", () => groupesGateways.getGroupeComportement("REN", 17)],
    ])("%s throws the mismatched 'Failed to get groupe infos' message", async (_name, call) => {
        mockFetchOnce({ ok: false });
        await expect(call()).rejects.toThrow("Failed to get groupe infos");
    });
});
