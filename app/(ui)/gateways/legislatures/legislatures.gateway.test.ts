import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";

function mockFetchOnce(response: { ok: boolean; status?: number; json?: () => Promise<unknown> }) {
    global.fetch = jest.fn().mockResolvedValue({
        ok: response.ok,
        status: response.status ?? (response.ok ? 200 : 500),
        json: response.json ?? (async () => ({})),
    }) as unknown as typeof fetch;
}

describe("legislaturesGateway.getCurrent", () => {
    afterEach(() => jest.resetAllMocks());

    it("GETs /api/legislatures/current and resolves with the parsed JSON", async () => {
        mockFetchOnce({ ok: true, json: async () => ({ number: 17 }) });

        await expect(legislaturesGateway.getCurrent()).resolves.toEqual({ number: 17 });
        expect(fetch).toHaveBeenCalledWith("/api/legislatures/current");
    });

    it("resolves with null on a 404", async () => {
        mockFetchOnce({ ok: false, status: 404 });

        await expect(legislaturesGateway.getCurrent()).resolves.toBeNull();
    });

    it("throws on any other non-ok status", async () => {
        mockFetchOnce({ ok: false, status: 500 });

        await expect(legislaturesGateway.getCurrent()).rejects.toThrow("Failed to get current legislature");
    });
});

describe("legislaturesGateway.getAll", () => {
    afterEach(() => jest.resetAllMocks());

    it("GETs /api/legislatures and resolves with the parsed JSON", async () => {
        mockFetchOnce({ ok: true, json: async () => [{ number: 16 }, { number: 17 }] });

        await expect(legislaturesGateway.getAll()).resolves.toEqual([{ number: 16 }, { number: 17 }]);
        expect(fetch).toHaveBeenCalledWith("/api/legislatures");
    });

    it("throws when the response is not ok", async () => {
        mockFetchOnce({ ok: false });

        await expect(legislaturesGateway.getAll()).rejects.toThrow("Failed to get legislatures");
    });
});
