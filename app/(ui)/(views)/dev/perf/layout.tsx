import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { DEV_PERF_ENABLED } from "@/app/_shared/dev-perf/dev-perf.config";
import { isLocalRequest } from "@/app/_shared/dev-perf/dev-perf.guard";

/**
 * Outil de perf réservé au poste du développeur : un vrai 404 sans
 * NEXT_PUBLIC_DEV_PERF=true (donc en production), et pour toute requête qui
 * ne vient pas de la machine elle-même (voir dev-perf.guard).
 */
export default async function DevPerfLayout({ children }: { children: React.ReactNode }) {
    if (!DEV_PERF_ENABLED || !isLocalRequest(await headers())) notFound();
    return children;
}
