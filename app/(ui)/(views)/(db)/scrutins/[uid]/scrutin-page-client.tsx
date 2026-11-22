"use client";

import React, { useCallback, useMemo, useState } from "react";
import { AnchorLayout } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-layout";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { SectionBlockLoader } from "@/app/(ui)/component-library/template/sections/block-section/_loader/section-block-loader";
import { SpinnerLib } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import { ScrutinHeader } from "@/app/(ui)/components/scrutins/scrutin-header";
import { ScrutinHeaderSkeleton } from "@/app/(ui)/components/scrutins/scrutin-header-skeleton";
import { scrutinsGateway } from "@/app/(ui)/gateways/scrutins/scrutins.gateway";
import { ScrutinDetailDTO } from "@/app/domains/scrutins/dto/scrutin-detail.dto";
import { SCRUTIN_SECTIONS } from "@/app/(ui)/(views)/(db)/scrutins/[uid]/config";
import { useAsyncData } from "@/app/(ui)/_shared/hook/use-async-data";
import { ErrorStateLib } from "@/app/(ui)/component-library/molecules/error-state/error-state-lib";

// Un scrutin appartient à une seule législature : la page ne dépend pas du
// sélecteur de législature global, seulement de l'uid du scrutin.
export default function ScrutinPageClient({ uid, initialScrutin }: { uid: string; initialScrutin: ScrutinDetailDTO | null }) {
    const [readyCount, setReadyCount] = useState(0);

    // Le scrutin lu par la page serveur est passé aux sections (Résultat) : pas de second appel.
    const params = useMemo(() => ({ uid, scrutin: initialScrutin }), [uid, initialScrutin]);

    // Repli : la page serveur n'a pas pu le lire (erreur), le client le charge lui-même.
    const fallback = useAsyncData<ScrutinDetailDTO>(
        initialScrutin ? null : () => scrutinsGateway.getScrutin(uid),
        uid
    );
    const scrutin = initialScrutin ?? fallback.data;

    const sectionsToAwait = useMemo(() => SCRUTIN_SECTIONS.filter((s) => s.gatewayFn && !s.lazy), []);
    const allReady = readyCount >= sectionsToAwait.length;
    const noopReady = useCallback(() => {}, []);
    const handleReady = useCallback(() => setReadyCount((c) => c + 1), []);

    return (
        <AnchorLayout
            header={
                scrutin ? <ScrutinHeader scrutin={scrutin} />
                    : fallback.error ? <ErrorStateLib message="Impossible de charger ce scrutin pour le moment." onRetry={fallback.retry} />
                    : <ScrutinHeaderSkeleton />
            }
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
