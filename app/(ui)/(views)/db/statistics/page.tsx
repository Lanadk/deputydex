"use client";

import React from "react";
import { PageContentLib } from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import { STATISTICS_SECTIONS } from "@/app/(ui)/(views)/db/statistics/statistics-sections.config";
import { useLegislature } from "@/app/(ui)/providers/legislature-provider";
import {AnchorSectionBlockLib} from "@/app/(ui)/component-library/template/anchor-section/anchor-section-block-lib";
import {BlockSectionRenderer} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";

export default function StatistiquesPage() {
    const { legislature } = useLegislature();
    const legislatureNum = legislature?.number ?? 17;

    return (
        <PageContentLib>
            {STATISTICS_SECTIONS.map((section) => (
                <AnchorSectionBlockLib
                    key={section.id}
                    id={section.id}
                    title={section.label}
                    description={section.description}
                    icon={section.icon}
                    cols={section.cols ?? 2}
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
    );
}