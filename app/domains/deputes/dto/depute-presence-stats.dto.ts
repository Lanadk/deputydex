export type DeputePresenceStatsDTO = {
  monthlyPresenceRate: {
    month: string;
    presenceRate: number | string | unknown;
  }[];
}