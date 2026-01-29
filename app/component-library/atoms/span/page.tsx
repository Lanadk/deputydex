"use client"

import {CodeBlock} from "@/app/component-library/molecules/code-block/code-block";
import {SpanLib} from "@/app/component-library/atoms/span/span-lib";
import {Heart, ChevronRight} from "lucide-react";
import {useState} from "react";
import {
    SPAN_CLICKABLE,
    SPAN_EMOJI,
    SPAN_ICON_CLICKABLE,
    SPAN_LUCIDE_ICON,
    SPAN_TEXT
} from "@/app/component-library/atoms/span/span-lib.constants";
import {PageHeaderLib} from "@/app/component-library/molecules/page-header/page-header-lib";

export default function SpanPage() {
    const [clickCount, setClickCount] = useState(0);

    return (
        <div>
            <PageHeaderLib
                title="Span"
                subtitle="Composant span inline avec support de texte, children et icônes"
            />

            <div className="space-y-8">
                <div>
                    <h3>Texte simple</h3>
                    <div className="mt-4">
                        <CodeBlock code={SPAN_TEXT}>
                            <SpanLib>Simple texte inline</SpanLib>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Avec emoji</h3>
                    <div className="mt-4">
                        <CodeBlock code={SPAN_EMOJI}>
                            <SpanLib>🎉 Avec emoji</SpanLib>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Avec icône Lucide</h3>
                    <div className="mt-4">
                        <CodeBlock code={SPAN_LUCIDE_ICON}>
                            <SpanLib>
                                <Heart size={16}/> J&apos;aime
                            </SpanLib>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Icône + Texte cliquable</h3>
                    <div className="mt-4">
                        <CodeBlock code={SPAN_ICON_CLICKABLE}>
                            <SpanLib onClick={() => alert('Cliqué!')}>
                                Voir plus <ChevronRight size={16}/>
                            </SpanLib>
                        </CodeBlock>
                    </div>
                </div>

                <div>
                    <h3>Avec compteur dynamique</h3>
                    <div className="mt-4">
                        <CodeBlock code={SPAN_CLICKABLE}>
                            <div className="space-y-2">
                                <SpanLib
                                    onClick={() => setClickCount(clickCount + 1)}
                                >
                                    Clique-moi 👆
                                </SpanLib>
                                <p className="text-sm text-gray-600">{`Cliqué ${clickCount} fois`}</p>
                            </div>
                        </CodeBlock>
                    </div>
                </div>
            </div>
        </div>
    );
}