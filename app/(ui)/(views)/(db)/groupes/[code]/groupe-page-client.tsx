"use client";

import {useLegislature} from "@/app/(ui)/providers/legislature-provider";
import React, {useEffect, useState} from "react";
import {AnchorLayout} from "@/app/(ui)/component-library/template/anchor-section/anchor-layout";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {AnchorSectionBlockLib} from "@/app/(ui)/component-library/template/anchor-section/anchor-section-block-lib";
import {BlockSectionRenderer} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";
import {GROUPES_SECTIONS} from "@/app/(ui)/(views)/(db)/groupes/[code]/groupes-sections.config";
import {GroupeHeader} from "@/app/(ui)/components/groups/fiche/groupe-header";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";
import {groupesGateways} from "@/app/(ui)/gateways/groupes/groupes.gateway";
import {GroupeHeaderSkeleton} from "@/app/(ui)/components/groups/fiche/groupe-header-skeleton";

export default function GroupePageClient({code}: { code: string }) {
    const {legislature} = useLegislature();
    const legislatureNum = legislature?.number ?? 17;

    const [groupeInfos, setGroupeInfos] = useState<GroupeInfosDTO>();

    useEffect(() => {
        if (!legislatureNum) return;

        //call api code + leg
        groupesGateways.getGroupeInfos(code, legislatureNum)
            .then(setGroupeInfos)
            .catch(console.error);
    }, [code, legislatureNum]);

    return (
        <AnchorLayout
            header={
                groupeInfos
                    ? <GroupeHeader groupeInfos={groupeInfos}/>
                    : <GroupeHeaderSkeleton/>
            }
            sections={GROUPES_SECTIONS}
        >
            <PageContentLib>
                {GROUPES_SECTIONS.map((section) => (
                    <AnchorSectionBlockLib
                        key={section.id}
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
                                legislature={legislatureNum}
                            />
                        ))}
                    </AnchorSectionBlockLib>
                ))}
            </PageContentLib>
        </AnchorLayout>
    );
}