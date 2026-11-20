import { ActivityDetailLinksDTO } from "@/app/domains/activity/activity-detail-links";

export type GroupeActivityDetailsDTO = ActivityDetailLinksDTO & {
    date: string;
    domain: 'vote' | 'scrutin' | 'amendement' | 'amendement_co';
    refId: string;
    meta: {
        type: string;
        [key: string]: any;
    };
};
