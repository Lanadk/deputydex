"use client";

import React, {useEffect, useRef} from "react";
import {AnchorSectionBlockLib} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-section-block-lib";
import {BlockSectionRenderer} from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import {useFetchSectionData} from "@/app/(ui)/_shared/hook/useSectionData";
import {PageSection} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";

interface SectionBlockLoaderProps {
    section: PageSection;
    params: Record<string, unknown>;
    onReady: () => void;
}

export function SectionBlockLoader({ section, params, onReady }: SectionBlockLoaderProps) {
    const { dataMap, loading } = useFetchSectionData(section.gatewayFn, params);

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
                    params={params}
                    actions={section.actions}
                />
            ))}
        </AnchorSectionBlockLib>
    );
}