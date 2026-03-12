"use client";

import {useEffect, useState} from "react";
import {useParams, useSearchParams} from "next/navigation";
import {FicheDeputeDTO} from "@/app/domains/acteurs/dto/fiche-depute.dto";
import {DEPUTE_CONFIG, DeputeSection} from "./deputy-id-sections.config";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {AnchorSectionBlockLib} from "@/app/(ui)/component-library/template/anchor-section/anchor-section-block-lib";
import {BlockSectionRenderer} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";
import {
    AnchorDeputeTemplateLib
} from "@/app/(ui)/component-library/template/anchor-deputy-section/anchor-deputy-layout-lib";
import DeputyCardLib from "@/app/(ui)/component-library/molecules/deputy-card/deputy-card-lib";

export default function DeputePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const legislatureNum = Number(searchParams.get('legislature')) || 17;

    const id = params.id as string;

    const [state, setState] = useState<{
        deputy: FicheDeputeDTO | null;
        sections: DeputeSection[];
        loading: boolean;
    }>({
        deputy: null,
        sections: DEPUTE_CONFIG.sections,
        loading: true,
    });

    useEffect(() => {
        DEPUTE_CONFIG.gatewayFn(id, legislatureNum)
            .then((data) => {
                if (!data) return;
                setState({
                    deputy: data,
                    sections: DEPUTE_CONFIG.sections.map((section) => ({
                        ...section,
                        blocks: section.buildBlocks ? section.buildBlocks(data) : section.blocks,
                    })),
                    loading: false,
                });
            })
            .catch(() => setState((prev) => ({...prev, loading: false})));
    }, [id, legislatureNum]);

    const {deputy, sections, loading} = state;

    if (loading || !deputy) return null;

    return (
        <AnchorDeputeTemplateLib
            title={`${deputy.nom ?? ""} ${deputy.prenom ?? ""}`}
            subtitle={`${deputy.circonscription ?? ""} - ${deputy.region ?? ""}`}
            sections={sections}
            card={
                <DeputyCardLib
                    nom={deputy.nom ?? ""}
                    groupe="LR"
                    image={deputy.image ?? ""}
                />
            }
        >
            <PageContentLib>
                {sections.map((section) => (
                    <AnchorSectionBlockLib
                        key={section.id}
                        id={section.id}
                        title={section.label}
                        description={section.description}
                        icon={section.icon}
                        cols={section.cols}
                    >
                        {section.blocks.map((block, j) => (
                            <BlockSectionRenderer
                                key={j}
                                block={block}
                                legislature={legislatureNum}
                            />
                        ))}
                    </AnchorSectionBlockLib>
                ))}
            </PageContentLib>
        </AnchorDeputeTemplateLib>
    );
}