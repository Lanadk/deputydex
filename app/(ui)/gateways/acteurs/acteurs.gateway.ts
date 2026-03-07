import {ActeursGateway} from "@/app/domains/acteurs/gateways/Iacteurs.gateway";

export const acteursGateway: ActeursGateway = {
    async search(query, page = 1, pageSize = 20) {
        const res = await fetch("/api/acteurs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, page, pageSize }),
        });

        if (!res.ok) throw new Error("Failed to search acteurs");
        return res.json();
    },

    async getById(id) {
        const res = await fetch(`/api/acteurs/${id}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to get acteur");
        return res.json();
    },
};