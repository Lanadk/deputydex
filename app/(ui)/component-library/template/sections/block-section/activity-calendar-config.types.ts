export type ActivityCalendarDay = {
    date: string;
    count: number;
    level: number;
};

export type ActivityCalendarDisplayType =
    | 'basic'
    | 'tooltip'
    | 'tooltip-and-href';

export type ActivityCalendarDataWrapper = {
    data: ActivityCalendarDay[];
};

export type ActivityCalendarDetailItem = {
    date: string;
    domain: string;
    refId: string;
    meta: {
        type: string;
        [key: string]: any;
    };
    /** Page de l'amendement ou du scrutin (site de l'AN). */
    lienAN?: string | null;
    /** Dossier législatif de l'activité, quand il est connu. */
    dossier?: { uid: string; titre: string; lienAN: string } | null;
};

export type ActivityCalendarConfig = {
    id: string;
    displayType: ActivityCalendarDisplayType;
    title?: string;
    subtitle?: string;
    //TODO fix je pense
    onClick?: (params: {
        date: string;
    }) => void | Promise<void>;
};