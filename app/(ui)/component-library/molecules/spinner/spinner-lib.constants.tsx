"use client"

import { SpinnerLib } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

export const SPINNER_CODE_DEFAULT = `<SpinnerLib />`;

export const SPINNER_CODE_SIZES = `<div className="flex items-center gap-6">
  <SpinnerLib size={16} />
  <SpinnerLib size={32} />
  <SpinnerLib size={48} />
</div>`;

export const SPINNER_CODE_USE_CASE = `<div className="flex items-center justify-center gap-3 py-12">
  <SpinnerLib size={24} />
  <SpanLib>Chargement des données…</SpanLib>
</div>`;

export const getSpinnerSections = () => [
    {
        title: "Par défaut (32 px)",
        code: SPINNER_CODE_DEFAULT,
        component: <SpinnerLib />,
    },
    {
        title: "Tailles",
        code: SPINNER_CODE_SIZES,
        component: (
            <div className="flex items-center gap-6">
                <SpinnerLib size={16} />
                <SpinnerLib size={32} />
                <SpinnerLib size={48} />
            </div>
        ),
    },
    {
        title: "Cas d'usage : section en cours de chargement",
        code: SPINNER_CODE_USE_CASE,
        component: (
            <div className="flex items-center justify-center gap-3 py-12">
                <SpinnerLib size={24} />
                <SpanLib>Chargement des données…</SpanLib>
            </div>
        ),
    },
];
