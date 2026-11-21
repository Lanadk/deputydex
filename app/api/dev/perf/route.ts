import { NextResponse } from "next/server";
import { DEV_PERF_ENABLED } from "@/app/_shared/dev-perf/dev-perf.config";
import { clearDevPerf, getDevPerfSnapshot, recordClientPerf } from "@/app/_shared/dev-perf/dev-perf.store";
import { ClientPerfRecord } from "@/app/_shared/dev-perf/dev-perf.types";

/*
 * API de l'outil de perf (dev seulement, voir app/6.DEV-PERF.md).
 * GET : mesures en mémoire ; POST : mesures du navigateur ; DELETE : tout vider.
 * Sans NEXT_PUBLIC_DEV_PERF=true (donc en production) : 404 sur tout.
 */

// Lu à chaque requête, jamais mis en cache.
export const dynamic = "force-dynamic";

const NOT_FOUND = () => NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
const MAX_RECORDS_PER_POST = 200;

export async function GET(): Promise<Response> {
    if (!DEV_PERF_ENABLED) return NOT_FOUND();
    return NextResponse.json(getDevPerfSnapshot(), { headers: { "Cache-Control": "no-store" } });
}

function isClientRecord(r: unknown): r is ClientPerfRecord {
    const x = r as Partial<ClientPerfRecord> | null;
    return !!x && (x.kind === "section" || x.kind === "fetch")
        && typeof x.visitId === "string" && typeof x.path === "string"
        && typeof x.startMs === "number" && typeof x.durationMs === "number";
}

export async function POST(req: Request): Promise<Response> {
    if (!DEV_PERF_ENABLED) return NOT_FOUND();
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }
    if (!Array.isArray(body)) return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });

    recordClientPerf(body.slice(0, MAX_RECORDS_PER_POST).filter(isClientRecord));
    return new NextResponse(null, { status: 204 });
}

export async function DELETE(): Promise<Response> {
    if (!DEV_PERF_ENABLED) return NOT_FOUND();
    clearDevPerf();
    return new NextResponse(null, { status: 204 });
}
