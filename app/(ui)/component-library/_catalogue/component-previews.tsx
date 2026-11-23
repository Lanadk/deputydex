"use client"

import { ComponentPreview } from "@/app/(ui)/component-library/_catalogue/catalog-card";
import { getButtonSections } from "@/app/(ui)/component-library/atoms/button/button-lib.constants";
import { getSpanSections } from "@/app/(ui)/component-library/atoms/span/span-lib.constants";
import { getBadgeSections } from "@/app/(ui)/component-library/atoms/badge/badge-lib.constants";
import { getAvatarSections } from "@/app/(ui)/component-library/atoms/badge-avatar/avatar-picture-lib.constants";
import { getInputSections } from "@/app/(ui)/component-library/molecules/input/input-lib.constants";
import { getSelectSections } from "@/app/(ui)/component-library/molecules/select/select-lib.constants";
import { getCheckboxSections } from "@/app/(ui)/component-library/molecules/checkbox/checkbox-lib.constants";
import { getToggleSwitchSections } from "@/app/(ui)/component-library/molecules/toggle-switch/toggle-switch-lib.constants";
import { getFilterGroupSections } from "@/app/(ui)/component-library/molecules/filter-group/filter-group-lib.constants";
import { getFilterBarSections } from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar-lib.constants";
import { getTableSections } from "@/app/(ui)/component-library/molecules/table/table-lib.constants";
import { getChartSection } from "@/app/(ui)/component-library/molecules/chart/chart.constants";
import { getActivityCalendarSections } from "@/app/(ui)/component-library/molecules/activity-calendar/activity-calendar.constants-lib";
import { getDifficultyGaugeSections } from "@/app/(ui)/component-library/molecules/difficulty-gauge/difficulty-gauge-lib.constants";
import { getCardsSections } from "@/app/(ui)/component-library/molecules/cards/cards-lib.constants";
import { getDeputyCardSections } from "@/app/(ui)/component-library/molecules/deputy/deputy-card.constants";
import { getGroupMiniCardSections } from "@/app/(ui)/component-library/molecules/group-mini-card/group-mini-card-lib.constants";
import { getExpandableCardSections } from "@/app/(ui)/component-library/molecules/expandable-card/expandable-card-lib.constants";
import { getBentoSections } from "@/app/(ui)/component-library/molecules/bento/bento-lib.constants";
import { getScrollHintSections } from "@/app/(ui)/component-library/molecules/scroll-hint/scroll-hint-lib.constants";
import { getScrollProgressSections } from "@/app/(ui)/component-library/molecules/scroll-progress/scroll-progress-lib.constants";
import { getDeviceFrameSections } from "@/app/(ui)/component-library/molecules/device-frame/device-frame-lib.constants";
import { getPageStateSections } from "@/app/(ui)/component-library/molecules/page-state/page-state-lib.constants";
import { getTimelineSections } from "@/app/(ui)/component-library/molecules/timeline/timeline-lib.constants";
import { getOrgChartSections } from "@/app/(ui)/component-library/molecules/org-chart/org-chart-lib.constants";
import { getInfoTipSections } from "@/app/(ui)/component-library/molecules/info-tip/info-tip-lib.constants";
import { getTooltipSections } from "@/app/(ui)/component-library/molecules/tooltip/tooltip-lib.constants";
import { getProportionBarSections } from "@/app/(ui)/component-library/molecules/proportion-bar/proportion-bar-lib.constants";
import { getErrorStateSections } from "@/app/(ui)/component-library/molecules/error-state/error-state-lib.constants";
import { getNotificationSections } from "@/app/(ui)/component-library/molecules/notification/notification-lib.constants";
import { getSpinnerSections } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib.constants";
import { getThemeSwitcherSections } from "@/app/(ui)/component-library/molecules/theme-switcher/theme-switcher-lib.constants";
import { getCodeBlockSections } from "@/app/(ui)/component-library/molecules/code-block/code-block-lib.constants";
import { getTabsSections } from "@/app/(ui)/component-library/molecules/tabs/tabs-lib.constants";
import { getBaseLayoutSections } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib.constants";
import { getPageContentSections } from "@/app/(ui)/component-library/template/page-content/page-content-lib.constants";
import { getPageHeaderSections } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib.constants";
import { getBlockSectionLibSections } from "@/app/(ui)/component-library/template/sections/block-section/block-section-lib.constants";
import { getAnchorSectionLibSections } from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-section-lib.constants";

/*
 * Aperçus du catalogue : on réutilise une section des pages de démo (la plus
 * représentative, choisie par son index) pour ne pas maintenir deux exemples.
 * Les démos interactives attendent un état : l'aperçu étant inerte, on leur
 * passe des valeurs fixes et des setters vides.
 */
const noop = () => {};

// `width` : largeur de rendu du composant (l'aperçu fait au moins 560 px de large).
export const COMPONENT_PREVIEWS: Record<string, ComponentPreview> = {
    // Atoms
    '/component-library/atoms/button': { width: 440, render: () => getButtonSections("", noop)[0].component },
    '/component-library/atoms/span': { width: 440, render: () => getSpanSections(0, noop)[2].component },
    '/component-library/atoms/badge': { width: 440, render: () => getBadgeSections()[3].component },
    '/component-library/atoms/badge-avatar': { width: 520, render: () => getAvatarSections()[0].component },
    // Molecules
    '/component-library/molecules/input': { width: 440, render: () => getInputSections("", noop, "", noop, "Désactivé")[1].component },
    '/component-library/molecules/select': { width: 440, render: () => getSelectSections("", noop, "", noop, "", noop)[1].component },
    '/component-library/molecules/checkbox': { width: 440, render: () => getCheckboxSections(true, noop, true, noop, [], noop)[3].component },
    '/component-library/molecules/toggle-switch': { width: 440, render: () => getToggleSwitchSections(true, noop, false, noop, true, noop, false, noop, true, noop)[0].component },
    '/component-library/molecules/filter-group': { width: 600, render: () => getFilterGroupSections()[1].component },
    '/component-library/molecules/filter-bar': { width: 1000, render: () => getFilterBarSections()[0].component },
    '/component-library/molecules/table': { width: 1000, render: () => getTableSections()[1].component },
    '/component-library/molecules/chart': { width: 700, render: () => getChartSection()[0].component },
    '/component-library/molecules/activity-calendar': { width: 1000, render: () => getActivityCalendarSections()[0].component },
    '/component-library/molecules/difficulty-gauge': { width: 440, render: () => getDifficultyGaugeSections()[0].component },
    '/component-library/molecules/cards': { width: 600, render: () => getCardsSections()[2].component },
    '/component-library/molecules/deputy': { width: 1000, render: () => getDeputyCardSections()[0].component },
    '/component-library/molecules/group-mini-card': { width: 700, render: () => getGroupMiniCardSections()[0].component },
    '/component-library/molecules/expandable-card': { width: 700, render: () => getExpandableCardSections()[0].component },
    '/component-library/molecules/bento': { width: 1000, render: () => getBentoSections()[0].component },
    '/component-library/molecules/scroll-hint': { width: 440, render: () => getScrollHintSections()[0].component },
    '/component-library/molecules/scroll-progress': { width: 440, render: () => getScrollProgressSections()[0].component },
    '/component-library/molecules/device-frame': { width: 600, render: () => getDeviceFrameSections()[0].component },
    '/component-library/molecules/timeline': { width: 1000, render: () => getTimelineSections()[0].component },
    '/component-library/molecules/org-chart': { width: 700, render: () => getOrgChartSections()[0].component },
    '/component-library/molecules/info-tip': { width: 560, render: () => getInfoTipSections()[1].component },
    '/component-library/molecules/tooltip': { width: 440, render: () => getTooltipSections()[0].component },
    '/component-library/molecules/proportion-bar': { width: 700, render: () => getProportionBarSections()[0].component },
    '/component-library/molecules/page-state': { width: 700, render: () => getPageStateSections()[0].component },
    '/component-library/molecules/error-state': { width: 560, render: () => getErrorStateSections()[1].component },
    '/component-library/molecules/notification': { width: 440, render: () => getNotificationSections()[1].component },
    '/component-library/molecules/spinner': { width: 440, render: () => getSpinnerSections()[1].component },
    '/component-library/molecules/theme-switcher': { width: 440, render: () => getThemeSwitcherSections()[0].component },
    '/component-library/molecules/code-block': { width: 600, render: () => getCodeBlockSections()[0].component },
    '/component-library/molecules/tabs': { width: 560, render: () => getTabsSections()[1].component },
    // Templates
    '/component-library/template/base-layout': { width: 700, render: () => getBaseLayoutSections()[0].component },
    '/component-library/template/page-content': { width: 600, render: () => getPageContentSections()[0].component },
    '/component-library/template/headers/page-header': { width: 700, render: () => getPageHeaderSections()[0].component },
    '/component-library/template/sections/block-section': { width: 1000, render: () => getBlockSectionLibSections()[2].component },
    '/component-library/template/sections/anchor-section': { width: 1000, render: () => getAnchorSectionLibSections()[0].component },
};
