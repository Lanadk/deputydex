"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { ToggleSwitchLib } from "@/app/(ui)/component-library/molecules/toggle-switch/toggle-switch-lib";
import { TabsLib, tabPanelProps } from "@/app/(ui)/component-library/molecules/tabs/tabs-lib";
import { DevPerfSnapshot } from "@/app/_shared/dev-perf/dev-perf.types";
import { DEV_PERF_MAX_RECORDS } from "@/app/_shared/dev-perf/dev-perf.config";
import { groupSqlQueries, summarizeByDomain, summarizePages } from "@/app/_shared/dev-perf/dev-perf.aggregate";
import { ALL_REQUESTS, LiveTab } from "@/app/(ui)/components/dev-perf/live-tab";
import { RequestsTab } from "@/app/(ui)/components/dev-perf/requests-tab";
import { PagesTab } from "@/app/(ui)/components/dev-perf/pages-tab";
import { SqlTab } from "@/app/(ui)/components/dev-perf/sql-tab";
import { RendersTab } from "@/app/(ui)/components/dev-perf/renders-tab";
import { CompareTab } from "@/app/(ui)/components/dev-perf/compare-tab";

const REFRESH_MS = 2000;
const API = "/api/dev/perf";
const TABS_ID = "dev-perf";

type TabId = "direct" | "requetes" | "pages" | "rendu" | "sql" | "comparaison";

/**
 * Page /dev/perf : charge les mesures (toutes les 2 s en direct) et les
 * répartit en onglets — chaque onglet est un composant de components/dev-perf/.
 */
export default function DevPerfPageClient() {
    const [snapshot, setSnapshot] = useState<DevPerfSnapshot>({ apiCalls: [], client: [] });
    const [loadedAt, setLoadedAt] = useState(0);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [failed, setFailed] = useState(false);
    const [cacheCleared, setCacheCleared] = useState(false);
    const [tab, setTab] = useState<TabId>("direct");
    // « Tout » par défaut : une fenêtre glissante viderait le graphique dès qu'on cesse de naviguer.
    const [windowMs, setWindowMs] = useState<number | null>(null);
    const [family, setFamily] = useState<string | null>(null);
    const [selectedPath, setSelectedPath] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            const res = await fetch(API, { cache: "no-store" });
            if (!res.ok) throw new Error(String(res.status));
            setSnapshot(await res.json());
            setLoadedAt(Date.now());
            setFailed(false);
        } catch {
            setFailed(true);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
        if (!autoRefresh) return;
        const timer = setInterval(load, REFRESH_MS);
        return () => clearInterval(timer);
    }, [autoRefresh, load]);

    const clearMeasures = async () => {
        await fetch(API, { method: "DELETE" });
        setFamily(null);
        setSelectedPath(null);
        await load();
    };

    const clearServerCache = async () => {
        const res = await fetch(`${API}/cache`, { method: "DELETE" });
        setCacheCleared(res.ok);
    };

    const domains = useMemo(() => summarizeByDomain(snapshot.apiCalls, snapshot.client), [snapshot]);
    const pages = useMemo(() => summarizePages(snapshot.client), [snapshot.client]);
    const sqlQueries = useMemo(() => groupSqlQueries(snapshot.apiCalls), [snapshot.apiCalls]);
    const renderedBlocks = useMemo(
        () => new Set(snapshot.client.flatMap((r) => (r.kind === "render" ? [`${r.blockType}|${r.blockId}`] : []))).size,
        [snapshot.client]
    );
    // ALL_REQUESTS et non "" : SelectLib affiche son placeholder pour une valeur vide.
    const familyOptions = useMemo(() => [
        { value: ALL_REQUESTS, label: "Toutes les requêtes" },
        ...domains.flatMap((d) => d.requests.map((r) => ({ value: r.family, label: `${d.domain} · ${r.family}` }))),
    ], [domains]);

    const followRequest = (f: string | null) => {
        setFamily(f);
        if (f) setTab("direct");
    };

    const tabs = [
        { id: "direct", label: "En direct" },
        { id: "requetes", label: "Requêtes API", badge: domains.reduce((n, d) => n + d.requests.length, 0) },
        { id: "pages", label: "Pages & rendu", badge: pages.length },
        { id: "rendu", label: "Rendu des composants", badge: renderedBlocks },
        { id: "sql", label: "SQL", badge: sqlQueries.length },
        { id: "comparaison", label: "Comparaison" },
    ];

    return (
        <BaseLayout>
            <div className="mb-6 border-b border-main pb-6">
                <PageHeaderLib
                    title="Performances (dev)"
                    subtitle="Navigue sur le site dans un autre onglet : chaque appel d'API, sa durée côté base de données, serveur et navigateur, le rendu des pages et l'effet du cache apparaissent ici en direct."
                />
                <p className="mt-2 text-sm text-subtitle-accent">
                    En mode dev, les durées de rendu sont faussées (compilation à la première visite, double montage
                    du mode strict) ; les durées SQL sont fiables. Mesures sans biais :{" "}
                    <code className="font-mono">npm run build && npm run start</code>. Cache local :{" "}
                    <code className="font-mono">DEV_PERF_CACHE=true</code> dans <code className="font-mono">.env.local</code>.
                </p>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-4">
                <ToggleSwitchLib isActive={autoRefresh} onToggle={() => setAutoRefresh((v) => !v)} label="Direct (2 s)" />
                <ButtonLib text="Actualiser" variant="secondary" size="small" onClick={load} />
                <ButtonLib text="Vider les mesures" variant="tertiary" size="small" onClick={clearMeasures} />
                <ButtonLib text="Vider le cache serveur" variant="tertiary" size="small" onClick={clearServerCache} />
                {cacheCleared && (
                    <span className="text-sm text-subtitle-accent">Cache vidé : la prochaine visite d&apos;une page sera « à froid ».</span>
                )}
                {failed && <span className="text-sm" style={{ color: "var(--ui-danger)" }}>Lecture des mesures impossible.</span>}
                <span className="ml-auto text-sm text-subtitle-accent tabular-nums">
                    Mesures en mémoire : {snapshot.apiCalls.length} appels serveur, {snapshot.client.length} navigateur
                    {" "}(max. {DEV_PERF_MAX_RECORDS} chacun, les plus anciennes sont oubliées ; vidées au redémarrage)
                </span>
            </div>

            <div className="mb-6">
                <TabsLib
                    tabs={tabs}
                    activeId={tab}
                    onChange={(id) => setTab(id as TabId)}
                    ariaLabel="Vues de l'outil de performances"
                    idPrefix={TABS_ID}
                />
            </div>

            <div {...tabPanelProps(TABS_ID, tab)} className="focus:outline-none">
                {tab === "direct" && (
                    <LiveTab
                        client={snapshot.client}
                        now={loadedAt}
                        windowMs={windowMs}
                        onWindowChange={setWindowMs}
                        family={family}
                        onFamilyChange={setFamily}
                        familyOptions={familyOptions}
                    />
                )}
                {tab === "requetes" && <RequestsTab domains={domains} selectedFamily={family} onSelectFamily={followRequest} />}
                {tab === "pages" && <PagesTab pages={pages} selectedPath={selectedPath} onSelectPath={setSelectedPath} />}
                {tab === "rendu" && <RendersTab client={snapshot.client} />}
                {tab === "sql" && <SqlTab queries={sqlQueries} />}
                {tab === "comparaison" && <CompareTab snapshot={snapshot} />}
            </div>
        </BaseLayout>
    );
}
