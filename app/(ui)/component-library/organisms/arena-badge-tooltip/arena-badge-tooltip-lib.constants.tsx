"use client"

import { ArenaBadgeTooltipLib } from "@/app/(ui)/component-library/organisms/arena-badge-tooltip/arena-badge-tooltip-lib";
import { DEPUTY_ACHIEVEMENTS_PROPOSAL } from "@/app/(ui)/component-library/molecules/arena-badge/arena-badge-lib.constants";

export const ARENA_BADGE_TOOLTIP_CODE = `<ArenaBadgeTooltipLib
    variant="eclair"
    label="Frondeur"
    description="A voté contre la position majoritaire de son groupe sur au moins 50 scrutins."
    earnedOn="12 mars 2025"
/>`;

export const ARENA_BADGE_TOOLTIP_LOCKED_CODE = `<ArenaBadgeTooltipLib
    variant="lune"
    label="Noctambule"
    description="A voté lors de 20 scrutins tenus après minuit."
    locked
/>`;

export const ARENA_BADGE_TOOLTIP_CASE_CODE = `<div className="arena-badge-case">
  {achievements.map((a) => (
    <ArenaBadgeTooltipLib key={a.variant} {...a} size={56} hideLabel placement="bottom" />
  ))}
</div>`;

/** Démo : succès obtenus par un député fictif, avec leur date. */
const EARNED_ON: Partial<Record<string, string>> = {
    hemicycle: '3 octobre 2024',
    eclair: '12 mars 2025',
    feuille: '28 janvier 2025',
    octogone: '18 juillet 2024',
    cristal: '9 juin 2025',
};

export const getArenaBadgeTooltipSections = () => [
    {
        title: "Survoler le badge, ou y aller avec Tab (Échap ferme la bulle)",
        code: ARENA_BADGE_TOOLTIP_CODE,
        component: (
            <div className="py-10">
                <ArenaBadgeTooltipLib
                    variant="eclair"
                    label="Frondeur"
                    description="A voté contre la position majoritaire de son groupe sur au moins 50 scrutins."
                    earnedOn="12 mars 2025"
                />
            </div>
        ),
    },
    {
        title: "Badge pas encore obtenu",
        code: ARENA_BADGE_TOOLTIP_LOCKED_CODE,
        component: (
            <div className="py-10">
                <ArenaBadgeTooltipLib
                    variant="lune"
                    label="Noctambule"
                    description="A voté lors de 20 scrutins tenus après minuit."
                    locked
                />
            </div>
        ),
    },
    {
        title: "Étui d'un député : survoler chaque badge",
        code: ARENA_BADGE_TOOLTIP_CASE_CODE,
        component: (
            <div className="arena-badge-case">
                {DEPUTY_ACHIEVEMENTS_PROPOSAL.map(({ variant, label, rule }) => (
                    <ArenaBadgeTooltipLib
                        key={variant}
                        variant={variant}
                        label={label}
                        description={rule}
                        earnedOn={EARNED_ON[variant]}
                        locked={!EARNED_ON[variant]}
                        size={56}
                        hideLabel
                        placement="bottom"
                    />
                ))}
            </div>
        ),
    },
];
