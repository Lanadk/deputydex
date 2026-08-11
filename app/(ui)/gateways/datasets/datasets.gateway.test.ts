import { datasetsGateway } from "@/app/(ui)/gateways/datasets/datasets.gateway";

function mockFetchOnce(response: { ok: boolean; json?: () => Promise<unknown> }) {
    global.fetch = jest.fn().mockResolvedValue({
        ok: response.ok,
        json: response.json ?? (async () => ({})),
    }) as unknown as typeof fetch;
}

describe("datasetsGateway.getLastUpdate", () => {
    afterEach(() => jest.resetAllMocks());

    it("GETs /api/datasets/lastupdate and resolves with the parsed JSON", async () => {
        mockFetchOnce({ ok: true, json: async () => "2026-08-10T03:00:00.000Z" });

        await expect(datasetsGateway.getLastUpdate()).resolves.toBe("2026-08-10T03:00:00.000Z");
        expect(fetch).toHaveBeenCalledWith("/api/datasets/lastupdate");
    });

    it("throws when the response is not ok", async () => {
        mockFetchOnce({ ok: false });

        await expect(datasetsGateway.getLastUpdate()).rejects.toThrow("Failed to fetch last update");
    });
});
