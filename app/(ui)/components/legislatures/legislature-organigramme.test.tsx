import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { arbreAssemblee, arbreExecutif, LegislatureOrganigramme } from "@/app/(ui)/components/legislatures/legislature-organigramme";
import { LegislatureOrganisationDTO } from "@/app/domains/legislatures/dto/legislature-organisation.dto";

const p = (uid: string, nom: string, fonction = "") => ({ uid, nom, fonction, href: `/deputes/${uid}`, photoUrl: null, groupe: null });

const ORGANISATION: LegislatureOrganisationDTO = {
    legislature: 17,
    dateReference: "2026-11-22",
    presidence: { president: "Emmanuel Macron", mandat: "2e mandat", depuis: "2022-05-14" },
    gouvernements: [
        {
            id: "g2", libelle: "Gouvernement Lecornu II", premierMinistre: p("PA_L", "Sébastien Lecornu", "Premier ministre"),
            debut: "2025-10-10", fin: null,
            rangs: [{ rang: "ministre", libelle: "Ministres", membres: [{ ...p("PA_V", "Catherine Vautrin", "Ministre"), jusqua: "2026-03-01" }] }],
        },
        {
            id: "g1", libelle: "Gouvernement Barnier", premierMinistre: { ...p("PA_B", "Michel Barnier", "Premier ministre"), href: null },
            debut: "2024-09-05", fin: "2024-12-12", rangs: [],
        },
    ],
    assemblee: {
        president: p("PA_YBP", "Yaël Braun-Pivet", "Présidence de l'Assemblée"),
        vicePresidents: [p("PA_VP", "Sébastien Chenu")],
        questeurs: [],
        secretaires: [],
        presidentsGroupe: [{ ...p("PA_GA", "Gabriel Attal"), groupeCode: "EPR", groupeLibelle: "Ensemble pour la République" }],
        presidentsCommission: [{ ...p("PA_C", "Éric Coquerel"), commission: "Finances, économie générale et contrôle budgétaire" }],
    },
};

describe("organigrammes de la législature", () => {
    it("exécutif : Président → Premier ministre → rangs → membres (avec départ)", () => {
        const arbre = arbreExecutif(ORGANISATION, ORGANISATION.gouvernements[0]);

        expect(arbre.title).toBe("Emmanuel Macron");
        const pm = arbre.children![0];
        expect(pm).toMatchObject({ title: "Sébastien Lecornu", href: "/deputes/PA_L" });
        expect(pm.subtitle).toContain("Gouvernement Lecornu II, depuis le 10/10/2025");
        expect(pm.children![0]).toMatchObject({ title: "Ministres", subtitle: "1 membre" });
        expect(pm.children![0].children![0]).toMatchObject({ title: "Catherine Vautrin", note: "jusqu'au 01/03/2026" });
    });

    it("Assemblée : présidence puis branches non vides seulement", () => {
        const arbre = arbreAssemblee(ORGANISATION);

        expect(arbre).toMatchObject({ title: "Yaël Braun-Pivet", href: "/deputes/PA_YBP" });
        expect(arbre.children!.map((c) => c.title)).toEqual([
            "Vice-présidences", "Présidences de groupe", "Présidences de commission permanente",
        ]);
        expect(arbre.children![1].children![0]).toMatchObject({ title: "Gabriel Attal", subtitle: "Ensemble pour la République" });
    });

    it("photo et pastille du groupe politique, aux couleurs du groupe", () => {
        const arbre = arbreAssemblee({
            ...ORGANISATION,
            assemblee: {
                ...ORGANISATION.assemblee,
                president: { ...ORGANISATION.assemblee.president!, photoUrl: "/photo.jpg", groupe: { code: "EPR", libelle: "Ensemble pour la République" } },
            },
        });

        expect(arbre.avatar).toEqual({ src: "/photo.jpg" });
        expect(arbre.badge).toMatchObject({ label: "EPR", title: "Groupe : Ensemble pour la République" });
        expect(arbre.badge!.background).toBeTruthy();
        // Sans groupe : pas de pastille, mais un avatar (initiales).
        expect(arbre.children![0].children![0]).toMatchObject({ badge: null, avatar: { src: null } });
    });

    it("un onglet par gouvernement ; le plus récent d'abord, puis bascule", () => {
        render(<LegislatureOrganigramme organisation={ORGANISATION} />);

        expect(screen.getByRole("tab", { name: "Gouvernement Lecornu II" })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByRole("link", { name: "Sébastien Lecornu" })).toBeInTheDocument();

        fireEvent.click(screen.getByRole("tab", { name: "Gouvernement Barnier" }));
        // Michel Barnier n'a pas de fiche député : pas de lien.
        expect(screen.getByText("Michel Barnier")).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "Michel Barnier" })).not.toBeInTheDocument();
    });
});
