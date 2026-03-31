"use client";

import {useLegislature} from "@/app/(ui)/providers/legislature-provider";
import React, {useEffect, useState} from "react";
import {AnchorLayout} from "@/app/(ui)/component-library/template/anchor-section/anchor-layout";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {AnchorSectionBlockLib} from "@/app/(ui)/component-library/template/anchor-section/anchor-section-block-lib";
import {BlockSectionRenderer} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";
import {GroupeHeader} from "@/app/(ui)/components/groups/fiche/groupe-header";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";
import {groupesGateways} from "@/app/(ui)/gateways/groupes/groupes.gateway";
import {GroupeHeaderSkeleton} from "@/app/(ui)/components/groups/fiche/groupe-header-skeleton";
import {GROUPES_SECTIONS, GroupesSection} from "@/app/(ui)/(views)/(db)/groupes/[code]/config";
import {useFetchSectionData} from "@/app/(ui)/_shared/hook/useSectionData";

// Composant isolé pour que chaque section ait son propre hook, infine plus tard le cache va gerer les perfs + si sections lourds, lazyloading
function GroupeSection({ section, legislatureNum }: { section: GroupesSection; legislatureNum: number }) {
    const {dataMap, loading} = useFetchSectionData(section.gatewayFn, legislatureNum);

    return (
        <AnchorSectionBlockLib
            id={section.id}
            title={section.label}
            description={section.description}
            icon={section.icon}
            cols={section.cols}
        >
            {section.blocks.map((block, i) => (
                <BlockSectionRenderer
                    key={i}
                    block={block}
                    dataMap={dataMap}
                    loading={loading}
                />
            ))}
        </AnchorSectionBlockLib>
    );
}

export default function GroupePageClient({code}: { code: string }) {
    const {legislature} = useLegislature();
    const legislatureNum = legislature?.number ?? 17;

    const [groupeInfos, setGroupeInfos] = useState<GroupeInfosDTO>();

    useEffect(() => {
        groupesGateways.getGroupeInfos(code, legislatureNum)
            .then(setGroupeInfos)
            .catch(console.error);
    }, [code, legislatureNum]);

    return (
        <AnchorLayout
            header={groupeInfos ? <GroupeHeader groupeInfos={groupeInfos}/> : <GroupeHeaderSkeleton/>}
            sections={GROUPES_SECTIONS}
        >
            <div className="mt-4">
                <PageContentLib>
                    {GROUPES_SECTIONS.map((section) => (
                        <GroupeSection
                            key={section.id}
                            section={section}
                            legislatureNum={legislatureNum}
                        />
                    ))}
                </PageContentLib>
            </div>
        </AnchorLayout>
    );
}