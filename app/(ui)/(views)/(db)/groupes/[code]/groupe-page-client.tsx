"use client";

import {useLegislature} from "@/app/(ui)/providers/legislature-provider";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {AnchorLayout} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-layout";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {GroupeHeader} from "@/app/(ui)/components/groups/fiche/groupe-header";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";
import {groupesGateways} from "@/app/(ui)/gateways/groupes/groupes.gateway";
import {GroupeHeaderSkeleton} from "@/app/(ui)/components/groups/fiche/groupe-header-skeleton";
import {GROUPES_SECTIONS} from "@/app/(ui)/(views)/(db)/groupes/[code]/config";
import {SpinnerLib} from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import {SectionBlockLoader} from "@/app/(ui)/component-library/template/sections/block-section/_loader/section-block-loader";

export default function GroupePageClient({code}: { code: string }) {
    const [readyCount, setReadyCount] = useState(0);
    const [groupeInfos, setGroupeInfos] = useState<GroupeInfosDTO>();
    const {legislature} = useLegislature();
    const legislatureNum = legislature?.number ?? 17;

    const params = useMemo(() => ({ code, legislature: legislatureNum }), [code, legislatureNum]);


    useEffect(() => {
        groupesGateways.getGroupeInfos(code, legislatureNum)
            .then(setGroupeInfos)
            .catch(console.error);
    }, [code, legislatureNum]);

    const sectionsToAwait = useMemo(
        () => GROUPES_SECTIONS.filter(s => s.gatewayFn && !s.lazy),
        []
    );
    const allReady = readyCount >= sectionsToAwait.length;
    const noopReady = useCallback(() => {}, []);
    const handleReady = useCallback(() => {
        setReadyCount(c => c + 1);
    }, []);

    console.log('[Page] allReady:', allReady, 'readyCount:', readyCount, 'sectionsToAwait:', sectionsToAwait.length);

    return (
        <AnchorLayout
            header={groupeInfos ? <GroupeHeader groupeInfos={groupeInfos}/> : <GroupeHeaderSkeleton/>}
            sections={GROUPES_SECTIONS}
        >
            <div className="mt-4">
                {!allReady && (
                    <div className="flex items-center justify-center h-64">
                        <SpinnerLib />
                    </div>
                )}

                <div className={allReady ? "" : "hidden"}>
                    <PageContentLib>
                        {GROUPES_SECTIONS.map((section) => (
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