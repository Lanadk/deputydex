import {IActeursGateway} from "@/app/domains/acteurs/gateways/IActeurs.gateway";
import {ActeurDTO} from "@/app/domains/acteurs/dto/acteur.dto";
import {FicheDeputeDTO} from "@/app/domains/acteurs/dto/fiche-depute.dto";
import type {PaginatedResult} from "@/app/_shared/pagination/paginated-result";

export const acteursGateway: IActeursGateway = {
    async search(query, page = 1, pageSize = 20): Promise<PaginatedResult<ActeurDTO>> {
        const res = await fetch("/api/acteurs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, page, pageSize }),
        });

        if (!res.ok) throw new Error("Failed to search acteurs");
        return res.json();
    },

    async getById(id): Promise<ActeurDTO | null> {
        const res = await fetch(`/api/acteurs/${id}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to get acteur");
        return res.json();
    },

    async getFicheDepute(id: string, legislature: number): Promise<FicheDeputeDTO | null> {
        const res = await fetch(`/api/acteurs/${id}/fiche?legislature=${legislature}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to get fiche depute");
        return res.json();
    }
};