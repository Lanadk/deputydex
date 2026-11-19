"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnchorLayout } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-layout";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { SectionBlockLoader } from "@/app/(ui)/component-library/template/sections/block-section/_loader/section-block-loader";
import { SpinnerLib } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import { ScrutinHeader } from "@/app/(ui)/components/scrutins/scrutin-header";
import { ScrutinHeaderSkeleton } from "@/app/(ui)/components/scrutins/scrutin-header-skeleton";
import { scrutinsGateway } from "@/app/(ui)/gateways/scrutins/scrutins.gateway";
import { ScrutinDetailDTO } from "@/app/domains/scrutins/dto/scrutin-detail.dto";
import { SCRUTIN_SECTIONS } from "@/app/(ui)/(views)/(db)/scrutins/[uid]/config";

// Un scrutin appartient à une seule législature : la page ne dépend pas du
// sélecteur de législature global, seulement de l'uid du scrutin.
export default function ScrutinPageClient({ uid }: { uid: string }) {
    const [readyCount, setReadyCount] = useState(0);
    const [scrutin, setScrutin] = useState<ScrutinDetailDTO>();

    const params = useMemo(() => ({ uid }), [uid]);

    useEffect(() => {
        scrutinsGateway.getScrutin(uid).then(setScrutin).catch(console.error);
    }, [uid]);

    const sectionsToAwait = useMemo(() => SCRUTIN_SECTIONS.filter((s) => s.gatewayFn && !s.lazy), []);
    const allReady = readyCount >= sectionsToAwait.length;
    const noopReady = useCallback(() => {}, []);
    const handleReady = useCallback(() => setReadyCount((c) => c + 1), []);

    return (
        <AnchorLayout
            header={scrutin ? <ScrutinHeader scrutin={scrutin} /> : <ScrutinHeaderSkeleton />}
            sections={SCRUTIN_SECTIONS}
        >
            <div className="mt-4">
                {!allReady && (
                    <div className="flex items-center justify-center h-64">
                        <SpinnerLib />
                    </div>
                )}
                <div className={allReady ? "" : "hidden"}>
                    <PageContentLib>
                        {SCRUTIN_SECTIONS.map((section) => (
                            <SectionBlockLoader
                                key={section.id}
                                section={section}
                                params={params}
                                onReady={section.gatewayFn && !section.lazy ? handleReady : noopReady}
                            />
                        ))}
                    </PageContentLib>
                </div>
            </div>
        </AnchorLayout>
    );
}
