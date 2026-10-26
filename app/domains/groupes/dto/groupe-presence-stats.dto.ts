export type GroupPresenceStatsDTO = {
  averagePresenceRate: number;
  monthlyPresenceRate: {
    month: string;
    presenceRate: number | string | unknown;
  }[]
}