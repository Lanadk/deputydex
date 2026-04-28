import {IDataSetsGateway} from "@/app/domains/datasets/gateways/IDataSetsGateway";

export const datasetsGateway: IDataSetsGateway = {

    async getLastUpdate(): Promise<Date> {
        const res = await fetch(`/api/datasets/lastupdate`);

        if (!res.ok) {
            throw new Error("Failed to fetch last update");
        }

        return res.json();
    },
}