import { IStatisticsGateway } from "@/app/domains/statistics/gateways/IStatisticsGateway";

export const statisticsGateway: IStatisticsGateway = {
    async fetchStat(domain, slug, params) {
        const search = new URLSearchParams();
        if (params.entityId) search.set("entityId", params.entityId);
        if (params.filters) search.set("filters", JSON.stringify(params.filters));

        const query = search.toString();
        const res = await fetch(`/api/statistics/${domain}/${slug}${query ? `?${query}` : ""}`);

        if (!res.ok) {
            throw new Error(`Failed to fetch stat ${domain}/${slug}`);
        }

        return res.json();
    },
};
