import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ecransDisponibles, HOME_TABLET_SCREEN_MS, HomeTablet } from "@/app/(ui)/components/home/home-tablet";
import {
    deputesVitrine,
    groupesGaucheDroite,
    HOME_TABLET_DEPUTES,
    HomeTabletFiche,
} from "@/app/(ui)/components/home/home-tablet-ecrans";
import { ScrutinListItemDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { GroupeCardDTO } from "@/app/domains/groupes/dto/groupes-card.dto";

const SCRUTIN: ScrutinListItemDTO = {
    uid: "VTANR5L17V1",
    numero: "1234",
    date: "2026-11-18T00:00:00.000Z",
    titre: "l'ensemble du projet de loi de finances",
    type: { code: "SPS", libelle: "Scrutin public solennel" },
    resultat: { isAdopte: true, libelle: "adopté" },
    objet: { code: "ensemble", libelle: "Ensemble d'un texte" },
    pour: 300,
    contre: 200,
    abstentions: 50,
};

const groupe = (code: string, membres: number): GroupeCardDTO => ({
    groupeId: code, groupeCode: code, groupeLabel: code, groupePresidentFullName: `Président ${code}`,
    groupeQualitySexLabel: "Président du", groupeCountMembers: membres, groupeHref: `/groupes/${code}`,
});
const GROUPES = [groupe("RN", 123), groupe("LFI-NFP", 71), groupe("VIDE", 0)];

const FICHE: HomeTabletFiche = {
    depute: { deputeUID: "PA794954", deputeFullName: "Emeric Salmon", deputeGroupeCode: "RN", deputeImage: "/img/salmon.png" },
    stats: {
        totalVotes: 9000, totalPour: 3000, totalContre: 4000, totalAbstentions: 1400, totalNonVotants: 600,
        rebelVotesCount: 40, tauxFidelite: 88.4, tauxParticipation: 93.3,
    },
    activite: [{ date: "2026-11-18", count: 40, level: 4 }, { date: "2026-11-10", count: 3, level: 1 }],
};

const legende = () => screen.getByTestId("home-tablet-caption");
const finDeBarre = () => fireEvent.animationEnd(screen.getByTestId("home-tablet-progress"));
const ecranActif = (container: HTMLElement) => container.querySelector(".home-tablet__screen.is-active")?.getAttribute("data-screen");

describe("HomeTablet", () => {
    it("chaque écran dure 10 s : la barre de progression de la légende dure autant", () => {
        render(<HomeTablet cards={[]} legislature={null} />);

        expect(HOME_TABLET_SCREEN_MS).toBe(10_000);
        expect(screen.getByTestId("home-tablet-progress")).toHaveStyle({ animationDuration: "10000ms" });
    });

    it("passe à l'écran suivant à la fin de la barre de progression ; la légende suit", () => {
        const { container } = render(<HomeTablet cards={[]} legislature="17ᵉ législature" scrutin={SCRUTIN} groupes={GROUPES} />);

        expect(ecranActif(container)).toBe("deputes");
        expect(legende()).toHaveTextContent("Explorer les députés");
        expect(screen.getByRole("link", { name: /Ouvrir le DéputéDex/ })).toHaveAttribute("href", "/deputydex");

        finDeBarre();
        expect(ecranActif(container)).toBe("groupes");
        expect(legende()).toHaveTextContent("Comprendre les groupes politiques");
        expect(container).toHaveTextContent("Président RN");

        finDeBarre();
        expect(ecranActif(container)).toBe("stats");
        expect(legende()).toHaveTextContent("Analyser l'Assemblée en graphiques");

        finDeBarre();
        expect(ecranActif(container)).toBe("scrutin");
        expect(container).toHaveTextContent("L'ensemble du projet de loi de finances");

        finDeBarre();
        expect(ecranActif(container)).toBe("deputes");
    });

    it("un écran qui apparaît en cours de route (données chargées après coup) ne change pas l'écran affiché", () => {
        const { container, rerender } = render(<HomeTablet cards={[]} legislature={null} />);
        finDeBarre();
        expect(ecranActif(container)).toBe("stats");

        rerender(<HomeTablet cards={[]} legislature={null} scrutin={SCRUTIN} groupes={GROUPES} />);
        expect(ecranActif(container)).toBe("stats");
        expect(legende()).toHaveTextContent("Analyser l'Assemblée en graphiques");
    });

    it("DéputéDex en miniature : un député avec photo par groupe, de la gauche à la droite, sans les non-inscrits", () => {
        const carte = (uid: string, groupe: string, image = `/img/${uid}.png`) => ({
            deputeUID: uid, deputeFullName: `Député ${uid}`, deputeGroupeCode: groupe, deputeImage: image,
        });
        const vitrine = deputesVitrine([
            carte("rn-sans-photo", "RN", ""),
            carte("rn-1", "RN"),
            carte("rn-2", "RN"),
            carte("ni-1", "NI-17"),
            carte("ni-2", "NI"),
            carte("lfi-1", "LFI-NFP"),
            carte("epr-1", "EPR"),
        ]);

        expect(vitrine.map((c) => c.deputeUID)).toEqual(["lfi-1", "epr-1", "rn-1"]);
    });

    it("grille miniature : pas plus de HOME_TABLET_DEPUTES cartes", () => {
        const cards = Array.from({ length: 20 }, (_, i) => ({
            deputeUID: `PA${i}`, deputeFullName: `Député ${i}`, deputeGroupeCode: `G${i}`, deputeImage: `/img/${i}.png`,
        }));
        const { container } = render(<HomeTablet cards={cards} legislature={null} />);

        expect(container.querySelectorAll(".home-tablet__deputes-grid > *")).toHaveLength(HOME_TABLET_DEPUTES);
    });

    it("la tablette est décorative et inerte, la légende et son lien restent accessibles", () => {
        const { container } = render(<HomeTablet cards={[]} legislature={null} scrutin={SCRUTIN} />);

        expect(container.querySelector(".home-tablet__stage")).toHaveAttribute("aria-hidden", "true");
        expect(container.querySelector(".home-tablet__stage")).toHaveAttribute("inert");
        expect(legende().closest("[aria-hidden]")).toBeNull();
    });

    it("écrans de la fiche, des groupes et du scrutin seulement si leurs données sont chargées", () => {
        expect(ecransDisponibles(null).map((e) => e.id)).toEqual(["deputes", "stats"]);
        expect(ecransDisponibles(SCRUTIN, GROUPES, FICHE).map((e) => e.id)).toEqual(["deputes", "activite", "groupes", "stats", "scrutin"]);
    });

    it("fiche député miniature : identité, chiffres de vote et calendrier d'activité réels", () => {
        const { container } = render(<HomeTablet cards={[]} legislature={null} fiche={FICHE} />);
        finDeBarre();

        expect(ecranActif(container)).toBe("activite");
        expect(legende()).toHaveTextContent("Suivre l'activité de chaque député");
        const fiche = container.querySelector('[data-screen="activite"]') as HTMLElement;
        expect(fiche).toHaveTextContent("Emeric Salmon");
        expect(fiche).toHaveTextContent("93 %participation");
        expect(fiche).toHaveTextContent("88 %fidélité au groupe");
        expect(fiche.querySelector('.home-tablet__calendrier-jour[data-niveau="4"]')).toBeInTheDocument();
    });

    it("groupes de la gauche vers la droite, sans les groupes vides", () => {
        expect(groupesGaucheDroite(GROUPES).map((g) => g.groupeCode)).toEqual(["LFI-NFP", "RN"]);
    });
});
