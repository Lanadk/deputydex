import { acteursGateway } from "@/app/(ui)/gateways/acteurs/acteurs.gateway";

function mockFetchOnce(response: { ok: boolean; status?: number; json?: () => Promise<unknown> }) {
    global.fetch = jest.fn().mockResolvedValue({
        ok: response.ok,
        status: response.status ?? (response.ok ? 200 : 500),
        json: response.json ?? (async () => ({})),
    }) as unknown as typeof fetch;
}

describe("acteursGateway.search", () => {
    afterEach(() => jest.resetAllMocks());

    it("POSTs to /api/acteurs with the query/page/pageSize as JSON", async () => {
        mockFetchOnce({ ok: true, json: async () => ({ items: [], total: 0 }) });

        await acteursGateway.search({ orderBy: [], where: {} }, 2, 10);

        expect(fetch).toHaveBeenCalledWith("/api/acteurs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: { orderBy: [], where: {} }, page: 2, pageSize: 10 }),
        });
    });

    it("defaults page/pageSize to 1/20 when omitted", async () => {
        mockFetchOnce({ ok: true, json: async () => ({}) });

        await acteursGateway.search({ orderBy: [], where: {} });

        const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
        expect(body).toMatchObject({ page: 1, pageSize: 20 });
    });

    it("resolves with the parsed JSON on success", async () => {
        const data = { items: [{ id: "PA1" }], total: 1 };
        mockFetchOnce({ ok: true, json: async () => data });

        await expect(acteursGateway.search({ orderBy: [], where: {} })).resolves.toEqual(data);
    });

    it("throws when the response is not ok", async () => {
        mockFetchOnce({ ok: false });

        await expect(acteursGateway.search({ orderBy: [], where: {} })).rejects.toThrow(
            "Failed to search acteurs"
        );
    });
});

describe("acteursGateway.getById", () => {
    afterEach(() => jest.resetAllMocks());

    it("GETs /api/acteurs/:id and resolves with the parsed JSON", async () => {
        mockFetchOnce({ ok: true, json: async () => ({ id: "PA1" }) });

        await expect(acteursGateway.getById("PA1")).resolves.toEqual({ id: "PA1" });
        expect(fetch).toHaveBeenCalledWith("/api/acteurs/PA1");
    });

    it("resolves with null on a 404", async () => {
        mockFetchOnce({ ok: false, status: 404 });

        await expect(acteursGateway.getById("UNKNOWN")).resolves.toBeNull();
    });

    it("throws on any other non-ok status", async () => {
        mockFetchOnce({ ok: false, status: 500 });

        await expect(acteursGateway.getById("PA1")).rejects.toThrow("Failed to get acteur");
    });
});

describe("acteursGateway.searchDeputies", () => {
    afterEach(() => jest.resetAllMocks());

    it("GETs /api/acteurs/deputies without a query string when search is omitted", async () => {
        mockFetchOnce({ ok: true, json: async () => [] });

        await acteursGateway.searchDeputies();

        expect(fetch).toHaveBeenCalledWith("/api/acteurs/deputies");
    });

    it("appends an encoded ?search= query string when provided", async () => {
        mockFetchOnce({ ok: true, json: async () => [] });

        await acteursGateway.searchDeputies("du rand");

        expect(fetch).toHaveBeenCalledWith("/api/acteurs/deputies?search=du%20rand");
    });

    it("resolves with the parsed JSON on success", async () => {
        const data = [{ id: "PA1", prenom: "Amélie", nom: "Durand" }];
        mockFetchOnce({ ok: true, json: async () => data });

        await expect(acteursGateway.searchDeputies()).resolves.toEqual(data);
    });

    it("throws when the response is not ok", async () => {
        mockFetchOnce({ ok: false });

        await expect(acteursGateway.searchDeputies()).rejects.toThrow("Failed to search deputies");
    });
});
