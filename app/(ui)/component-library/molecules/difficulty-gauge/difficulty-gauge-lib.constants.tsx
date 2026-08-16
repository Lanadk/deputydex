"use client"

import {DifficultyGaugeLib} from "@/app/(ui)/component-library/molecules/difficulty-gauge/difficulty-gauge-lib";
import {SpanLib} from "@/app/(ui)/component-library/atoms/span/span-lib";

export const DIFFICULTY_GAUGE_CODE_LEVELS = `<div className="flex flex-col gap-2">
  <DifficultyGaugeLib level={1} />
  <DifficultyGaugeLib level={2} />
  <DifficultyGaugeLib level={3} />
  <DifficultyGaugeLib level={4} />
  <DifficultyGaugeLib level={5} />
</div>`;

export const DIFFICULTY_GAUGE_CODE_NO_LABEL = `<DifficultyGaugeLib level={4} showLabel={false} />`;

export const DIFFICULTY_GAUGE_CODE_CUSTOM_LABEL = `<DifficultyGaugeLib level={3} label="Confirmé" />`;

export const DIFFICULTY_GAUGE_CODE_SMALL = `<DifficultyGaugeLib level={2} size="small" />`;

export const DIFFICULTY_GAUGE_CODE_USE_CASE = `<div className="flex items-center justify-between gap-4">
  <SpanLib>Agrégation des statistiques (ETL)</SpanLib>
  <DifficultyGaugeLib level={4} size="small" />
</div>`;

export const getDifficultyGaugeSections = () => [
    {
        title: "Les 5 niveaux",
        code: DIFFICULTY_GAUGE_CODE_LEVELS,
        component: (
            <div className="flex flex-col gap-2">
                <DifficultyGaugeLib level={1}/>
                <DifficultyGaugeLib level={2}/>
                <DifficultyGaugeLib level={3}/>
                <DifficultyGaugeLib level={4}/>
                <DifficultyGaugeLib level={5}/>
            </div>
        )
    },
    {
        title: "Sans libellé",
        code: DIFFICULTY_GAUGE_CODE_NO_LABEL,
        component: <DifficultyGaugeLib level={4} showLabel={false}/>
    },
    {
        title: "Libellé personnalisé",
        code: DIFFICULTY_GAUGE_CODE_CUSTOM_LABEL,
        component: <DifficultyGaugeLib level={3} label="Confirmé"/>
    },
    {
        title: "Taille small",
        code: DIFFICULTY_GAUGE_CODE_SMALL,
        component: <DifficultyGaugeLib level={2} size="small"/>
    },
    {
        title: "Cas d'usage",
        code: DIFFICULTY_GAUGE_CODE_USE_CASE,
        component: (
            <div className="flex items-center justify-between gap-4 max-w-sm">
                <SpanLib>Agrégation des statistiques (ETL)</SpanLib>
                <DifficultyGaugeLib level={4} size="small"/>
            </div>
        )
    }
];
