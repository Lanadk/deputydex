"use client";

import React, {useEffect, useRef} from "react";
import {AnchorSectionBlockLib, GRID_COLS_CLASS} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-section-block-lib";
import {BlockSectionRenderer} from "@/app/(ui)/component-library/template/sections/block-section/block-section-renderer";
import {useFetchSectionData} from "@/app/(ui)/_shared/hook/useSectionData";
import {PageSection} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor.types";

interface SectionBlockLoaderProps {
    section: PageSection;
    params: Record<string, unknown>;
    onReady: () => void;
    /**
     * Masque l'en-tête propre à la section (icône/titre/description) — pour
     * une page qui n'a qu'UNE section, ce header duplique déjà le
     * PageHeaderLib au-dessus (voir chiffres-cles/[theme]/theme-page-client.tsx).
     * `false` par défaut : `groupes/[code]` (plusieurs sections, chacune avec
     * son propre en-tête + son ancre de nav) n'est pas affecté.
     */
    hideHeader?: boolean;
}

export function SectionBlockLoader({ section, params, onReady, hideHeader = false }: SectionBlockLoaderProps) {
    const { dataMap, loading } = useFetchSectionData(section.gatewayFn, params);

    const hasCalledReady = useRef(false);

    useEffect(() => {
        if (!loading && !hasCalledReady.current) {
            hasCalledReady.current = true;
            onReady();
        }
    }, [loading]);

    const blocks = section.blocks.map((block, i) => (
        <BlockSectionRenderer
            key={i}
            block={block}
            dataMap={dataMap}
            loading={loading}
            params={params}
            actions={section.actions}
        />
    ));

    if (hideHeader) {
        return (
            <div id={section.id} className={`grid ${GRID_COLS_CLASS[section.cols]} gap-4`}>
                {blocks}
            </div>
        );
    }

    return (
        <AnchorSectionBlockLib
            id={section.id}
            title={section.label}
            description={section.description}
            icon={section.icon}
            cols={section.cols}
        >
            {blocks}
        </AnchorSectionBlockLib>
    );
}