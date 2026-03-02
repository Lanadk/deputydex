"use client"

import {BadgeLib} from "@/app/component-library/atoms/badge/badge-lib";
import {SpanLib} from "@/app/component-library/atoms/span/span-lib";

export const BADGE_CODE_PRIMARY = `<BadgeLib text="Primary" variant="primary" />`;
export const BADGE_CODE_SECONDARY = `<BadgeLib text="Secondary" variant="secondary" />`;
export const BADGE_CODE_TERTIARY = `<BadgeLib text="Tertiary" variant="tertiary" />`;
export const BADGE_CODE_MULTIPLE = `<div className="flex gap-2">
  <BadgeLib text="New" variant="primary" />
  <BadgeLib text="Hot" variant="secondary" />
  <BadgeLib text="Sale" variant="tertiary" />
</div>`;
export const BADGE_CODE_USE_CASE = `<div className="flex items-center gap-2">
  <SpanLib>Status:</SpanLib>
  <BadgeLib text="Active" variant="primary" />
</div>

<div className="flex items-center gap-2">
  <SpanLib>Tags:</SpanLib>
  <BadgeLib text="React" variant="secondary" />
  <BadgeLib text="TypeScript" variant="secondary" />
  <BadgeLib text="Next.js" variant="secondary" />
</div>`;

export const getBadgeSections = () => [
    {
        title: "Primary",
        code: BADGE_CODE_PRIMARY,
        component: <BadgeLib text="Primary" variant="primary"/>
    },
    {
        title: "Secondary",
        code: BADGE_CODE_SECONDARY,
        component: <BadgeLib text="Secondary" variant="secondary"/>
    },
    {
        title: "Tertiary",
        code: BADGE_CODE_TERTIARY,
        component: <BadgeLib text="Tertiary" variant="tertiary"/>
    },
    {
        title: "Multiple badges",
        code: BADGE_CODE_MULTIPLE,
        component: (
            <div className="flex gap-2">
                <BadgeLib text="New" variant="primary"/>
                <BadgeLib text="Hot" variant="secondary"/>
                <BadgeLib text="Sale" variant="tertiary"/>
            </div>
        )
    },
    {
        title: "Cas d'usage",
        code: BADGE_CODE_USE_CASE,
        component: (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <SpanLib>Status:</SpanLib>
                    <BadgeLib text="Active" variant="primary"/>
                </div>
                <div className="flex items-center gap-2">
                    <SpanLib>Tags:</SpanLib>
                    <BadgeLib text="React" variant="secondary"/>
                    <BadgeLib text="TypeScript" variant="secondary"/>
                    <BadgeLib text="Next.js" variant="secondary"/>
                </div>
            </div>
        )
    }
];