import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";

function mockFetchOnce(response: { ok: boolean; json?: () => Promise<unknown> }) {
    global.fetch = jest.fn().mockResolvedValue({
        ok: response.ok,
        json: response.json ?? (async () => ({})),
    }) as unknown as typeof fetch;
}

describe("deputesGateway — cards", () => {
    afterEach(() => jest.resetAllMocks());

    it.each([
        ["getDeputesCards", () => deputesGateway.getDeputesCards(17), "/api/deputes/cards/17"],
        ["getDeputesCardsSample", () => deputesGateway.getDeputesCardsSample(17), "/api/deputes/cards/17/sample"],
        ["getDeputesIndicateurs", () => deputesGateway.getDeputesIndicateurs(17), "/api/deputes/indicateurs/17"],
    ])("%s calls the expected URL and resolves with the parsed JSON", async (_name, call, expectedUrl) => {
        const data = [{ deputeUID: "PA1" }];
        mockFetchOnce({ ok: true, json: async () => data });

        await expect(call()).resolves.toEqual(data);
        expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });

    it.each([
        ["getDeputesCards", () => deputesGateway.getDeputesCards(17), "Failed to get deputes cards"],
        ["getDeputesCardsSample", () => deputesGateway.getDeputesCardsSample(17), "Failed to get deputes cards sample"],
        ["getDeputesIndicateurs", () => deputesGateway.getDeputesIndicateurs(17), "Failed to get deputes indicateurs"],
    ])("%s throws '%s' on a non-ok response", async (_name, call, expectedMessage) => {
        mockFetchOnce({ ok: false });
        await expect(call()).rejects.toThrow(expectedMessage as string);
    });
});
