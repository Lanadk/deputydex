"use client"

import { CodeBlockLib } from "@/app/(ui)/component-library/molecules/code-block/code-block-lib";
import { ComponentSectionCodeBlockLib } from "@/app/(ui)/component-library/template/sections/code-block-section/component-section-code-block-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { BadgeLib } from "@/app/(ui)/component-library/atoms/badge/badge-lib";

export const CODE_BLOCK_CODE_DEFAULT = `<CodeBlockLib code={\`<ButtonLib text="Valider" />\`}>
  <ButtonLib text="Valider" />
</CodeBlockLib>`;

export const CODE_BLOCK_CODE_SECTION = `<ComponentSectionCodeBlockLib
  title="Badge"
  description="Un titre et une description au-dessus de l'aperçu."
  code={\`<BadgeLib text="Adopté" variant="primary" />\`}
>
  <BadgeLib text="Adopté" variant="primary" />
</ComponentSectionCodeBlockLib>`;

export const getCodeBlockSections = () => [
    {
        title: "CodeBlockLib : aperçu + code repliable",
        description: "Affiche le composant, puis son code au clic sur « Show Code ».",
        code: CODE_BLOCK_CODE_DEFAULT,
        component: (
            <CodeBlockLib code={`<ButtonLib text="Valider" />`}>
                <ButtonLib text="Valider" />
            </CodeBlockLib>
        ),
    },
    {
        title: "ComponentSectionCodeBlockLib : section de démo",
        description: "CodeBlockLib précédé d'un titre et d'une description. C'est la brique de toutes les pages de cette librairie.",
        code: CODE_BLOCK_CODE_SECTION,
        component: (
            <ComponentSectionCodeBlockLib
                title="Badge"
                description="Un titre et une description au-dessus de l'aperçu."
                code={`<BadgeLib text="Adopté" variant="primary" />`}
            >
                <BadgeLib text="Adopté" variant="primary" />
            </ComponentSectionCodeBlockLib>
        ),
    },
];
