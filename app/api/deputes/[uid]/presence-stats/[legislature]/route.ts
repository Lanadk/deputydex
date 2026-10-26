import { NextResponse } from "next/server";
import { isOk } from "@/app/_shared/result-pattern/result";
import { cachedJson, cachedRead } from "@/app/_shared/cache/cached-response";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ uid: string; legislature: string }> }
): Promise<Response> {
    const { uid, legislature } = await params;
    try {
        const result = {
            data: {
                averagePresenceRate: 19,
                monthlyPresenceRate: [
                { month: "1", presenceRate: 85 },
                { month: "2", presenceRate: 15 },
                { month: "3", presenceRate: 42 }
                ],
            }
        }
        return cachedJson(result.data);
        // const result = await cachedRead(
        //     () => getDeputeAveragePresenceRateUseCase(prismaDeputeAveragePresenceRateRepository, uid, Number(legislature)),
        //     ["depute-vote-stats", uid, legislature]
        // );
        if (isOk(result)) {
            return cachedJson(result.data);
        }
        if (result.error === "NOT_FOUND") return NextResponse.json({ error: "Aucune donnée de vote" }, { status: 404 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to get depute presence stats" }, { status: 500 });
    }
}