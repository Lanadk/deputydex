import {GROUPES_KPI_REGISTRY} from "@/app/(ui)/(views)/(db)/groupes/[code]/groupes-kpi-card.registry";
import {GROUPES_ACTIVITY_CALENDAR} from "@/app/(ui)/(views)/(db)/groupes/[code]/groupes-activity-calendar.registry";
import {makeRegistryHelper} from "@/app/_shared/registry/registry.helper";
import {GROUPE_TABLE_REGISTRY} from "@/app/(ui)/(views)/(db)/groupes/[code]/groupes-table.registry";

export const card = makeRegistryHelper(GROUPES_KPI_REGISTRY, "CardConfig");
export const activityCalendar = makeRegistryHelper(GROUPES_ACTIVITY_CALENDAR, "ActivityCalendarConfig")
export const table = makeRegistryHelper(GROUPE_TABLE_REGISTRY, "TableConfig");