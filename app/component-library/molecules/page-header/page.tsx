"use client"

import { CodeBlock } from "@/app/component-library/molecules/code-block/code-block"
import {
    PAGE_HEADER_CODE_BASIC,
    PAGE_HEADER_CODE_USE_CASE
} from "@/app/component-library/molecules/page-header/page-header-lib.constants";
import {PageHeaderLib} from "@/app/component-library/molecules/page-header/page-header-lib";

export default function PageHeaderLibPage() {
    return (
        <div>
            <PageHeaderLib
                title="Page Header"
                subtitle="Composant header de page avec titre et sous-titre pour uniformiser les en-têtes"
            />

            <div className="space-y-8">
                <div>
                    <h3>Usage basique</h3>
                    <div className="mt-4">
                        <CodeBlock code={PAGE_HEADER_CODE_BASIC}>
                            <PageHeaderLib
                                title="Titre de la page"
                                subtitle="Description ou sous-titre de la page"
                            />
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Exemples réels (pages de composants)</h3>
                    <div className="mt-4">
                        <CodeBlock code={PAGE_HEADER_CODE_USE_CASE}>
                            <div className="space-y-8">
                                <PageHeaderLib
                                    title="Button"
                                    subtitle="Composant bouton avec différentes variantes et options"
                                />
                                <PageHeaderLib
                                    title="Input"
                                    subtitle="Composant input pour recherche, filtres et saisie"
                                />
                                <PageHeaderLib
                                    title="Avatar"
                                    subtitle="Composant avatar rond avec photo ou initiales en fallback"
                                />
                            </div>
                        </CodeBlock>
                    </div>
                </div>
            </div>
        </div>
    )
}