export type GroupPresenceStatsDTO = {
  monthlyPresenceRate: {
    month: string;
    presenceRate: number | string | unknown;
  }[]
}