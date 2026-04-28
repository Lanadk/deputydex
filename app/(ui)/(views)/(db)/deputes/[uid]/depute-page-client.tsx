"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnchorLayout } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-layout";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { useLegislature } from "@/app/(ui)/providers/legislature-provider";
import { DeputeHeader } from "@/app/(ui)/components/deputy/fiche/depute-header";
import { DeputeHeaderSkeleton } from "@/app/(ui)/components/deputy/fiche/depute-header-skeleton";
import { SectionBlockLoader } from "@/app/(ui)/component-library/template/sections/block-section/_loader/section-block-loader";
import { SpinnerLib } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import { DeputeIdentityDTO } from "@/app/domains/deputes/dto/depute-identity.dto";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { DEPUTE_SECTIONS } from "@/app/(ui)/(views)/(db)/deputes/[uid]/config";

export default function DeputePageClient({ uid }: { uid: string }) {
    const [readyCount, setReadyCount] = useState(0);
    const [identity, setIdentity] = useState<DeputeIdentityDTO>();
    const { legislature } = useLegislature();
    const legislatureNum = legislature?.number ?? 17;

    const params = useMemo(
        () => ({ uid, legislature: legislatureNum }),
        [uid, legislatureNum]
    );

    useEffect(() => {
        deputesGateway
            .getDeputeIdentity(uid, legislatureNum)
            .then(setIdentity)
            .catch(console.error);
    }, [uid, legislatureNum]);

    const sectionsToAwait = useMemo(
        () => DEPUTE_SECTIONS.filter((s) => s.gatewayFn && !s.lazy),
        []
    );
    const allReady = readyCount >= sectionsToAwait.length;
    const noopReady = useCallback(() => {}, []);
    const handleReady = useCallback(() => setReadyCount((c) => c + 1), []);

    return (
        <AnchorLayout
            header={identity ? <DeputeHeader identity={identity} /> : <DeputeHeaderSkeleton />}
            sections={DEPUTE_SECTIONS}
        >
            <div className="mt-4">
                {!allReady && (
                    <div className="flex items-center justify-center h-64">
                        <SpinnerLib />
                    </div>
                )}
                <div className={allReady ? "" : "hidden"}>
                    <PageContentLib>
                        {DEPUTE_SECTIONS.map((section) => (
                            <SectionBlockLoader
                                key={section.id}
                                section={section}
                                params={params}
                                onReady={
                                    section.gatewayFn && !section.lazy
                                        ? handleReady
                                        : noopReady
                                }
                            />
                        ))}
                    </PageContentLib>
                </div>
            </div>
        </AnchorLayout>
    );
}
