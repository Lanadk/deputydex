import { ActivityDetailLinkColumns } from "@/app/domains/activity/activity-detail-links";

export type GroupeActivityDetailsEntity = ActivityDetailLinkColumns & {
    activity_date: Date;
    domain: string;
    ref_id: string;
    meta: any;
};
