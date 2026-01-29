"use client"

import {CodeBlock} from "@/app/component-library/molecules/code-block/code-block";
import {BadgeLib} from "@/app/component-library/atoms/badge/badge-lib";
import {
    BADGE_CODE_MULTIPLE,
    BADGE_CODE_PRIMARY,
    BADGE_CODE_SECONDARY,
    BADGE_CODE_TERTIARY, BADGE_CODE_USE_CASE
} from "@/app/component-library/atoms/badge/badge-lib.constants";
import {SpanLib} from "@/app/component-library/atoms/span/span-lib";
import {PageHeaderLib} from "@/app/component-library/molecules/page-header/page-header-lib";

export default function BadgePage() {
    return (
        <div>
            <PageHeaderLib
                title="Badge"
                subtitle="Composant badge pour afficher des labels, tags ou statuts"
            />

            <div className="space-y-8">
                <div>
                    <h3>Primary</h3>
                    <div className="mt-4">
                        <CodeBlock code={BADGE_CODE_PRIMARY}>
                            <BadgeLib text="Primary" variant="primary" />
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Secondary</h3>
                    <div className="mt-4">
                        <CodeBlock code={BADGE_CODE_SECONDARY}>
                            <BadgeLib text="Secondary" variant="secondary" />
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Tertiary</h3>
                    <div className="mt-4">
                        <CodeBlock code={BADGE_CODE_TERTIARY}>
                            <BadgeLib text="Tertiary" variant="tertiary" />
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Multiple badges</h3>
                    <div className="mt-4">
                        <CodeBlock code={BADGE_CODE_MULTIPLE}>
                            <div className="flex gap-2">
                                <BadgeLib text="New" variant="primary" />
                                <BadgeLib text="Hot" variant="secondary" />
                                <BadgeLib text="Sale" variant="tertiary" />
                            </div>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Cas usage</h3>
                    <div className="mt-4">
                        <CodeBlock code={BADGE_CODE_USE_CASE}>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <SpanLib>Status:</SpanLib>
                                    <BadgeLib text="Active" variant="primary" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <SpanLib>Tags:</SpanLib>
                                    <BadgeLib text="React" variant="secondary" />
                                    <BadgeLib text="TypeScript" variant="secondary" />
                                    <BadgeLib text="Next.js" variant="secondary" />
                                </div>
                            </div>
                        </CodeBlock>
                    </div>
                </div>
            </div>
        </div>
    );
}