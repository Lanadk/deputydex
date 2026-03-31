"use client";

import React, {useEffect, useRef} from "react";
import {AnchorSectionBlockLib} from "@/app/(ui)/component-library/template/anchor-section/anchor-section-block-lib";
import {BlockSectionRenderer} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";
import {useFetchSectionData} from "@/app/(ui)/_shared/hook/useSectionData";
import {PageSection} from "@/app/(ui)/component-library/template/anchor-section/anchor.types";

interface SectionBlockLoaderProps {
    section: PageSection;
    legislatureNum: number;
    onReady: () => void;
}

export function SectionBlockLoader({section, legislatureNum, onReady}: SectionBlockLoaderProps) {
    const {dataMap, loading} = useFetchSectionData(section.gatewayFn, legislatureNum);

    const hasCalledReady = useRef(false);

    useEffect(() => {
        if (!loading && !hasCalledReady.current) {
            hasCalledReady.current = true;
            onReady();
        }
    }, [loading]);

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