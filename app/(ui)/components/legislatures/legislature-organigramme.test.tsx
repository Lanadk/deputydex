import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { arbreAssemblee, arbreExecutif, creditsExecutif, LegislatureOrganigramme } from "@/app/(ui)/components/legislatures/legislature-organigramme";
import { FonctionAssembleeDTO, LegislatureOrganisationDTO, PersonneFonctionDTO } from "@/app/domains/legislatures/dto/legislature-organisation.dto";

const p = (uid: string, nom: string, fonction = ""): PersonneFonctionDTO =>
    ({ uid, nom, fonction, href: `/deputes/${uid}`, photoUrl: null, photoCredit: null, groupe: null });
const f = (uid: string, nom: string, fonction = ""): FonctionAssembleeDTO => ({ ...p(uid, nom, fonction), jusqua: null });

const CREDIT_BARNIER = { auteur: "Florian David", licence: "CC BY-SA 4.0", licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };

const ORGANISATION: LegislatureOrganisationDTO = {
    legislature: 17,
    dateReference: "2026-11-22",
    presidence: {
        president: "Emmanuel Macron", mandat: "2e mandat", depuis: "2022-05-14", photoUrl: "/president.jpg",
        photoCredit: { auteur: "The White House", licence: "Domaine public", licenceUrl: null },
    },
    gouvernements: [
        {
            id: "g2", libelle: "Gouvernement Lecornu II", premierMinistre: p("PA_L", "Sébastien Lecornu", "Premier ministre"),
            debut: "2025-10-10", fin: null,
            rangs: [{ rang: "ministre", libelle: "Ministres", membres: [{ ...p("PA_V", "Catherine Vautrin", "Ministre"), jusqua: "2026-03-01" }] }],
        },
        {
            id: "g1", libelle: "Gouvernement Barnier", premierMinistre: { ...p("PA_B", "Michel Barnier", "Premier ministre"), href: null, photoUrl: "/barnier.jpg", photoCredit: CREDIT_BARNIER },
            debut: "2024-09-05", fin: "2024-12-12", rangs: [],
        },
    ],
    sessions: [
        {
            id: "session-2025", libelle: "Session 2025-2026", debut: "2025-10-01", fin: null,
            president: f("PA_YBP", "Yaël Braun-Pivet", "Présidence de l'Assemblée"),
            vicePresidents: [f("PA_VP", "Sébastien Chenu")],
            questeurs: [],
            secretaires: [],
            presidentsGroupe: [{ ...f("PA_GA", "Gabriel Attal"), groupeCode: "EPR", groupeLibelle: "Ensemble pour la République" }],
            presidentsCommission: [{ ...f("PA_C", "Éric Coquerel"), commission: "Finances, économie générale et contrôle budgétaire" }],
        },
        {
            id: "session-2024", libelle: "Session 2024-2025", debut: "2024-07-18", fin: "2025-09-30",
            president: f("PA_YBP", "Yaël Braun-Pivet", "Présidence de l'Assemblée"),
            vicePresidents: [{ ...f("PA_VP0", "Clémence Guetté"), jusqua: "2024-10-21" }],
            questeurs: [],
            secretaires: [],
            presidentsGroupe: [],
            presidentsCommission: [],
        },
    ],
    definitions: {
        "assemblee-vice-president": { libelle: "Vice-présidence", definition: "Les vice-présidents président les séances.", source: "Règlement, art. 10" },
        ministre: { libelle: "Ministre", definition: "Membre du Gouvernement à la tête d'un ministère.", source: null },
    },
};

describe("organigrammes de la législature", () => {
    it("exécutif : Président → Premier ministre → rangs → membres (avec départ)", () => {
        const arbre = arbreExecutif(ORGANISATION, ORGANISATION.gouvernements[0]);

        expect(arbre.title).toBe("Emmanuel Macron");
        expect(arbre.avatar).toEqual({ src: "/president.jpg" });
        const pm = arbre.children![0];
        expect(pm).toMatchObject({ title: "Sébastien Lecornu", href: "/deputes/PA_L" });
        expect(pm.subtitle).toContain("Gouvernement Lecornu II, depuis le 10/10/2025");
        expect(pm.children![0]).toMatchObject({ title: "Ministres", variant: "group", subtitle: "1" });
        expect(pm.children![0].children![0]).toMatchObject({ title: "Catherine Vautrin", note: "jusqu'au 01/03/2026" });
    });

    it("Assemblée : présidence puis branches non vides seulement", () => {
        const arbre = arbreAssemblee(ORGANISATION.sessions[0]);

        expect(arbre).toMatchObject({ title: "Yaël Braun-Pivet", href: "/deputes/PA_YBP" });
        expect(arbre.children!.map((c) => c.title)).toEqual([
            "Vice-présidences", "Présidences de groupe", "Présidences de commission permanente",
        ]);
        expect(arbre.children![1].children![0]).toMatchObject({ title: "Gabriel Attal", subtitle: "Ensemble pour la République" });
    });

    it("définitions du référentiel en bulle, sur les fonctions connues seulement", () => {
        const assemblee = arbreAssemblee(ORGANISATION.sessions[0], ORGANISATION.definitions);
        expect(assemblee.children![0].info?.subject).toBe("Vice-présidence");
        expect(assemblee.children![1].info).toBeNull();
        expect(assemblee.info).toBeNull();

        const executif = arbreExecutif(ORGANISATION, ORGANISATION.gouvernements[0]);
        expect(executif.children![0].children![0].info?.subject).toBe("Ministre");
    });

    it("la bulle de définition s'ouvre au clic, avec sa source", () => {
        render(<LegislatureOrganigramme organisation={ORGANISATION} />);

        fireEvent.click(screen.getByRole("button", { name: "Définition : Vice-présidence" }));

        const bulle = screen.getByRole("note");
        expect(bulle).toHaveTextContent("Les vice-présidents président les séances.");
        expect(bulle).toHaveTextContent("Source : Règlement, art. 10");
    });

    it("Assemblée : départ en cours de session signalé", () => {
        const arbre = arbreAssemblee(ORGANISATION.sessions[1]);

        expect(arbre.children![0].children![0]).toMatchObject({ title: "Clémence Guetté", note: "jusqu'au 21/10/2024" });
    });

    it("photo et pastille du groupe politique, aux couleurs du groupe", () => {
        const session = ORGANISATION.sessions[0];
        const arbre = arbreAssemblee({
            ...session,
            president: { ...session.president!, photoUrl: "/photo.jpg", groupe: { code: "EPR", libelle: "Ensemble pour la République" } },
        });

        expect(arbre.avatar).toEqual({ src: "/photo.jpg" });
        expect(arbre.badge).toMatchObject({ label: "EPR", title: "Groupe : Ensemble pour la République" });
        expect(arbre.badge!.background).toBeTruthy();
        // Sans groupe : pas de pastille, mais un avatar (initiales).
        expect(arbre.children![0].children![0]).toMatchObject({ badge: null, avatar: { src: null } });
    });

    it("un onglet par institution : l'Assemblée nationale d'abord, puis l'exécutif", () => {
        render(<LegislatureOrganigramme organisation={ORGANISATION} />);

        const onglets = within(screen.getByRole("tablist", { name: "Institution présentée" })).getAllByRole("tab");
        expect(onglets).toHaveLength(2);
        expect(onglets[0]).toHaveAccessibleName("Assemblée nationale");
        expect(onglets[1]).toHaveAccessibleName("Exécutif");
        expect(screen.getByRole("tab", { name: "Assemblée nationale" })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByRole("link", { name: "Yaël Braun-Pivet" })).toBeInTheDocument();
        // Les onglets des gouvernements et les crédits photo n'appartiennent qu'à l'exécutif.
        expect(screen.queryByRole("tab", { name: "Gouvernement Lecornu II" })).not.toBeInTheDocument();
        expect(screen.queryByText(/Crédits photo/)).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("tab", { name: "Exécutif" }));

        expect(screen.getByRole("tab", { name: "Exécutif" })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByRole("link", { name: "Sébastien Lecornu" })).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "Yaël Braun-Pivet" })).not.toBeInTheDocument();
    });

    it("affichage pyramidal conservé d'un onglet à l'autre", () => {
        const { container } = render(<LegislatureOrganigramme organisation={ORGANISATION} />);

        fireEvent.click(screen.getByRole("button", { name: "Pyramide" }));
        expect(container.querySelector(".org-chart-lib--pyramide")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("tab", { name: "Exécutif" }));
        expect(container.querySelector(".org-chart-lib--pyramide")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Pyramide" })).toHaveAttribute("aria-pressed", "true");
    });

    it("un onglet par session de l'Assemblée ; la plus récente d'abord, puis bascule", () => {
        render(<LegislatureOrganigramme organisation={ORGANISATION} />);

        expect(screen.getByRole("tab", { name: "Session 2025-2026" })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByRole("link", { name: "Sébastien Chenu" })).toBeInTheDocument();

        fireEvent.click(screen.getByRole("tab", { name: "Session 2024-2025" }));

        expect(screen.getByRole("link", { name: "Clémence Guetté" })).toBeInTheDocument();
        expect(screen.getByText("jusqu'au 21/10/2024")).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "Sébastien Chenu" })).not.toBeInTheDocument();
    });

    it("un onglet par gouvernement ; le plus récent d'abord, puis bascule", () => {
        render(<LegislatureOrganigramme organisation={ORGANISATION} />);
        fireEvent.click(screen.getByRole("tab", { name: "Exécutif" }));

        expect(screen.getByRole("tab", { name: "Gouvernement Lecornu II" })).toHaveAttribute("aria-selected", "true");
        expect(screen.getByRole("link", { name: "Sébastien Lecornu" })).toBeInTheDocument();

        fireEvent.click(screen.getByRole("tab", { name: "Gouvernement Barnier" }));
        // Michel Barnier n'a pas de fiche député : pas de lien.
        expect(screen.getByText("Michel Barnier")).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "Michel Barnier" })).not.toBeInTheDocument();
    });

    it("crédits des portraits tiers du gouvernement affiché (pas des photos de député)", () => {
        expect(creditsExecutif(ORGANISATION, ORGANISATION.gouvernements[0]).map((c) => c.nom)).toEqual(["Emmanuel Macron"]);
        expect(creditsExecutif(ORGANISATION, ORGANISATION.gouvernements[1]).map((c) => c.nom)).toEqual(["Emmanuel Macron", "Michel Barnier"]);

        render(<LegislatureOrganigramme organisation={ORGANISATION} />);
        fireEvent.click(screen.getByRole("tab", { name: "Exécutif" }));
        fireEvent.click(screen.getByRole("tab", { name: "Gouvernement Barnier" }));

        expect(screen.getByText(/Crédits photo/)).toHaveTextContent("Emmanuel Macron : The White House (Domaine public) · Michel Barnier : Florian David (CC BY-SA 4.0).");
        expect(screen.getByRole("link", { name: "CC BY-SA 4.0" })).toHaveAttribute("href", CREDIT_BARNIER.licenceUrl);
    });
});
