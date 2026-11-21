import { ApiCallRecord, ClientPerfRecord, DevPerfSnapshot } from "@/app/_shared/dev-perf/dev-perf.types";
import { DEV_PERF_MAX_RECORDS } from "@/app/_shared/dev-perf/dev-perf.config";

type Store = { apiCalls: ApiCallRecord[]; client: ClientPerfRecord[]; nextId: number };

/*
 * Stockage en mémoire du process serveur, sur `globalThis` : en dev, les route
 * handlers et le reste du serveur peuvent charger ce module dans des instances
 * séparées ; `globalThis` garantit un seul stockage par process.
 */
const GLOBAL_KEY = "__deputydexDevPerf";

function store(): Store {
    const g = globalThis as unknown as Record<string, Store | undefined>;
    g[GLOBAL_KEY] ??= { apiCalls: [], client: [], nextId: 1 };
    return g[GLOBAL_KEY]!;
}

function pushBounded<T>(list: T[], item: T) {
    list.push(item);
    if (list.length > DEV_PERF_MAX_RECORDS) list.splice(0, list.length - DEV_PERF_MAX_RECORDS);
}

export function recordApiCall(call: Omit<ApiCallRecord, "id">) {
    const s = store();
    pushBounded(s.apiCalls, { ...call, id: s.nextId++ });
}

export function recordClientPerf(records: ClientPerfRecord[]) {
    const s = store();
    for (const r of records) pushBounded(s.client, r);
}

export function getDevPerfSnapshot(): DevPerfSnapshot {
    const s = store();
    return { apiCalls: [...s.apiCalls], client: [...s.client] };
}

export function clearDevPerf() {
    const s = store();
    s.apiCalls = [];
    s.client = [];
}
