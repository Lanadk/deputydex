import type { Metadata } from "next";
import DevPerfPageClient from "@/app/(ui)/(views)/dev/perf/dev-perf-page-client";

export const metadata: Metadata = {
    title: "Performances (dev)",
    robots: { index: false, follow: false },
};

export default function DevPerfPage() {
    return <DevPerfPageClient />;
}
