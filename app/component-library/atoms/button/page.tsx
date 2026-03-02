"use client"

import { useState } from "react";
import { PageHeader } from "@/app/component-library/molecules/page-header/page-header";
import { getButtonSections } from "@/app/component-library/atoms/button/button-lib.constants";
import {PageContent} from "@/app/component-library/template/page-content/page-content";
import {
    ComponentSectionCodeBlock
} from "@/app/component-library/molecules/component-section/component-section-code-block";

export default function ButtonPage() {
    const [message, setMessage] = useState('');
    const sections = getButtonSections(message, setMessage);

    return (
        <div>
            <PageHeader
                title="Button"
                subtitle="Composant bouton avec différentes variantes et options"
            />

            <PageContent>
                {sections.map((section, index) => (
                    <ComponentSectionCodeBlock
                        key={index}
                        title={section.title}
                        code={section.code}
                    >
                        {section.component}
                    </ComponentSectionCodeBlock>
                ))}
            </PageContent>
        </div>
    );

    /*  Sans DATA DRIVEN :

        <div>
            <PageHeaderLib
                title="Button"
                subtitle="Composant bouton avec différentes variantes et options"
            />

            <div className="space-y-8"> --> Template pour le Page Content

                Ceci est une section key=1
                <div>
                    <h3>Variants</h3> Ceci est un title pour la section 1
                    <div className="mt-4">
                        <CodeBlock code={BUTTON_CODE_VARIANTS}> ceci est un composantSectionCodeBlock pour la section 1 avec comme input : code = BUTTON_CODE_VARIANTS
                            <div className="flex gap-4 flex-wrap"> ceci est le composant à injecter dans le code block
                                <ButtonLib text="Primary" variant="primary" />
                                <ButtonLib text="Secondary" variant="secondary" />
                                <ButtonLib text="Tertiary" variant="tertiary" />
                            </div>
                        </CodeBlock>
                    </div>
                </div>
                fin de la section

                <div>
                    <h3>Sizes</h3>
                    <div className="mt-4">
                        <CodeBlock code={BUTTON_CODE_SIZES}>
                            <div className="flex gap-4 items-center flex-wrap">
                                <ButtonLib text="Small" size="small" />
                                <ButtonLib text="Medium" size="medium" />
                                <ButtonLib text="Large" size="large" />
                            </div>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>With Icon (Lucide)</h3>
                    <div className="mt-4">
                        <CodeBlock code={BUTTON_CODE_LUCIDE_ICON}>
                            <ButtonLib text="Add" icon={Plus}/>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>With Icon (React Icons)</h3>
                    <div className="mt-4">
                        <CodeBlock code={BUTTON_CODE_REACT_ICON}>
                            <ButtonLib text="Profile" icon={FaUser}/>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>With onClick</h3>
                    <div className="mt-4">
                        <CodeBlock code={BUTTON_CODE_ON_CLICK}>
                            <div className="space-y-2">
                                <ButtonLib
                                    text="Click Me"
                                    variant="primary"
                                    onClick={() => setMessage('Button clicked!')}
                                />
                                {message && (
                                    <p className="text-sm">{message}</p>
                                )}
                            </div>
                        </CodeBlock>
                    </div>
                </div>
            </div>
        </div>

     */
}