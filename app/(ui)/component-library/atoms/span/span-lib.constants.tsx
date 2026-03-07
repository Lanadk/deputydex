"use client"

import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";
import { Heart, ChevronRight } from "lucide-react";

export const SPAN_TEXT = `<SpanLib>Simple texte inline</SpanLib>`;
export const SPAN_EMOJI = `<SpanLib>🎉 Avec emoji</SpanLib>`;
export const SPAN_LUCIDE_ICON = `<SpanLib>
  <Heart size={16}/> J'aime
</SpanLib>`;
export const SPAN_ICON_CLICKABLE = `<SpanLib onClick={() => console.log('clicked')}>
  Voir plus <ChevronRight size={16}/>
</SpanLib>`;
export const SPAN_CLICKABLE = `<SpanLib onClick={() => setClickCount(clickCount + 1)}>
  Clique-moi
</SpanLib>`;

export const getSpanSections = (clickCount: number, setClickCount: (count: number) => void) => [
    {
        title: "Texte simple",
        code: SPAN_TEXT,
        component: <SpanLib>Simple texte inline</SpanLib>
    },
    {
        title: "Avec emoji",
        code: SPAN_EMOJI,
        component: <SpanLib>🎉 Avec emoji</SpanLib>
    },
    {
        title: "Avec icône Lucide",
        code: SPAN_LUCIDE_ICON,
        component: (
            <SpanLib>
                <Heart size={16}/> J&apos;aime
            </SpanLib>
        )
    },
    {
        title: "Icône + Texte cliquable",
        code: SPAN_ICON_CLICKABLE,
        component: (
            <SpanLib onClick={() => alert('Cliqué!')}>
                Voir plus <ChevronRight size={16}/>
            </SpanLib>
        )
    },
    {
        title: "Avec compteur dynamique",
        code: SPAN_CLICKABLE,
        component: (
            <div className="space-y-2">
                <SpanLib onClick={() => setClickCount(clickCount + 1)}>
                    Clique-moi 👆
                </SpanLib>
                <p className="text-sm">{`Cliqué ${clickCount} fois`}</p>
            </div>
        )
    }
];