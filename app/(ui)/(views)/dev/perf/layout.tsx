import { notFound } from "next/navigation";
import { DEV_PERF_ENABLED } from "@/app/_shared/dev-perf/dev-perf.config";

/**
 * Outil de perf réservé au poste du développeur : sans NEXT_PUBLIC_DEV_PERF=true
 * (donc en production), un vrai 404, comme pour la component-library.
 */
export default function DevPerfLayout({ children }: { children: React.ReactNode }) {
    if (!DEV_PERF_ENABLED) notFound();
    return children;
}
