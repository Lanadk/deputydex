import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BlockActivityCalendarRenderer } from "./block-activity-calendar-renderer";
import { ActivityCalendarDetailItem } from "@/app/(ui)/component-library/template/sections/block-section/activity-calendar-config.types";

// Le calendrier SVG (react-activity-calendar) ne se dessine pas dans jsdom : un bouton par jour suffit
// pour cliquer sur un jour comme le ferait l'utilisateur.
jest.mock("@/app/(ui)/component-library/molecules/activity-calendar/activity-calendar-lib", () => ({
    ActivityCalendarLib: ({ data, renderBlock }: {
        data: { date: string; count: number }[];
        renderBlock: (block: React.ReactElement, activity: { date: string }) => React.ReactElement;
    }) => (
        <div>
            {data.filter((d) => d.count > 0).map((d) => (
                <React.Fragment key={d.date}>{renderBlock(<button type="button">{d.date}</button>, d)}</React.Fragment>
            ))}
        </div>
    ),
}));

const AMENDEMENT: ActivityCalendarDetailItem = {
    date: "2025-11-18",
    domain: "amendement",
    refId: "AMANR5L17PO59048B1906P0D1N002834",
    meta: { type: "amendement", numero: "II-2834" },
    lienAN: "https://www.assemblee-nationale.fr/dyn/17/amendements/AMANR5L17PO59048B1906P0D1N002834",
    dossier: {
        uid: "DLR5L17N51520",
        titre: "Projet de loi de finances pour 2026",
        lienAN: "https://www.assemblee-nationale.fr/dyn/17/dossiers/DLR5L17N51520",
    },
};

const VOTE: ActivityCalendarDetailItem = {
    date: "2025-11-18",
    domain: "vote",
    refId: "VTANR5L17V3878",
    meta: { type: "vote", position: "contre", titre: "l'amendement n° 119" },
    lienAN: "https://www.assemblee-nationale.fr/dyn/17/scrutins/3878",
    dossier: null,
};

async function openDay(details: ActivityCalendarDetailItem[]) {
    render(
        <BlockActivityCalendarRenderer
            config={{ id: "cal", displayType: "tooltip-and-href" }}
            data={{ data: [{ date: "2025-11-18", count: 2, level: 2 }] }}
            loading={false}
            params={{ uid: "PA842029", legislature: 17 }}
            actions={{ onActivityClick: jest.fn().mockResolvedValue(details) }}
        />
    );
    fireEvent.click(screen.getByRole("button", { name: "2025-11-18" }));
    await screen.findByText(/Activité du/);
}

describe("BlockActivityCalendarRenderer — en-tête", () => {
    const deuxAnnees = { data: [{ date: "2025-11-18", count: 2, level: 2 }, { date: "2026-02-03", count: 1, level: 1 }] };

    it("titre à gauche et choix de l'année à droite, sur la même ligne", () => {
        render(
            <BlockActivityCalendarRenderer
                config={{ id: "cal", displayType: "tooltip-and-href", title: "Calendrier d'activité" }}
                data={deuxAnnees}
                loading={false}
                params={{}}
            />
        );

        const titre = screen.getByRole("heading", { name: "Calendrier d'activité" });
        const annee = screen.getByRole("combobox");
        expect(annee).toHaveValue("2026");
        // Même ligne d'en-tête : le titre (dans son bloc) et le sélecteur (dans le sien) sont voisins.
        expect(titre.parentElement!.parentElement).toBe(annee.closest(".w-32")!.parentElement);
    });

    it("sans titre et sur une seule année : pas d'en-tête", () => {
        render(
            <BlockActivityCalendarRenderer
                config={{ id: "cal", displayType: "tooltip-and-href" }}
                data={{ data: [{ date: "2025-11-18", count: 2, level: 2 }] }}
                loading={false}
                params={{}}
            />
        );

        expect(screen.queryByRole("heading")).not.toBeInTheDocument();
        expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });
});

describe("BlockActivityCalendarRenderer — activité d'un jour", () => {
    it("links each activity to its amendement or scrutin on the AN site", async () => {
        await openDay([AMENDEMENT, VOTE]);

        expect(screen.getByRole("link", { name: /Amendement n°II-2834 déposé/ }))
            .toHaveAttribute("href", AMENDEMENT.lienAN);
        expect(screen.getByRole("link", { name: /Vote "Contre" sur l'amendement n° 119/ }))
            .toHaveAttribute("href", VOTE.lienAN);
    });

    it("links to the dossier législatif when it is known", async () => {
        await openDay([AMENDEMENT, VOTE]);

        const dossierLinks = screen.getAllByRole("link", { name: /Projet de loi de finances pour 2026/ });
        expect(dossierLinks).toHaveLength(1);
        expect(dossierLinks[0]).toHaveAttribute("href", AMENDEMENT.dossier!.lienAN);
    });

    it("shows an activity without link as plain text", async () => {
        await openDay([{ ...VOTE, lienAN: null }]);

        expect(screen.getByText(/Vote "Contre"/)).toBeInTheDocument();
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});
