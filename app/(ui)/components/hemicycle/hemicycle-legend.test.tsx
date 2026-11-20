import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { HemicycleLegend } from "@/app/(ui)/components/hemicycle/hemicycle-legend";
import { HemicycleDetail, hemicycleDeputesHref } from "@/app/(ui)/components/hemicycle/hemicycle-detail";
import { HemicycleGroupe } from "@/app/(ui)/_shared/adapter/hemicycle.adapter";

const GROUPES: HemicycleGroupe[] = [
    {
        code: "LFI-NFP", shortLabel: "LFI-NFP", label: "La France insoumise", count: 71,
        presidence: "Présidente du groupe : Mathilde Panot", presidentFullName: "Mathilde Panot",
        presidentRole: "Présidente du groupe",
        president: { deputeUID: "PA1", deputeFullName: "Mathilde Panot", deputeGroupeCode: "LFI-NFP", deputeImage: "/img/PA1.png" },
    },
    {
        code: "NI-17", shortLabel: "NI", label: "Non inscrits", count: 10,
        presidence: null, presidentFullName: null, presidentRole: null, president: null,
    },
];

function Harness() {
    const [selected, setSelected] = useState<string | null>(null);
    const groupe = GROUPES.find((g) => g.code === selected) ?? null;
    return (
        <>
            <HemicycleLegend
                groupes={GROUPES}
                selectedCode={selected}
                onToggleAction={(code) => setSelected((cur) => (cur === code ? null : code))}
            />
            <HemicycleDetail groupe={groupe} total={81} />
        </>
    );
}

describe("HemicycleLegend + HemicycleDetail", () => {
    it("renders one pressed-state button per group, with its count", () => {
        render(<Harness />);

        const lfi = screen.getByRole("button", { name: "La France insoumise : 71 sièges" });
        expect(lfi).toHaveAttribute("aria-pressed", "false");
        expect(screen.getByRole("button", { name: "Non inscrits : 10 sièges" })).toBeInTheDocument();
        expect(screen.getByText("81 sièges")).toBeInTheDocument();
    });

    it("selects a group on click and deselects it on a second click", async () => {
        const user = userEvent.setup();
        render(<Harness />);
        const lfi = screen.getByRole("button", { name: "La France insoumise : 71 sièges" });

        await user.click(lfi);
        expect(lfi).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByText("Présidente du groupe : Mathilde Panot")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Voir les députés" })).toHaveAttribute("href", "/deputydex?groupe=LFI-NFP");
        // Carte du président·e = DeputyCard cliquable vers sa fiche, comme dans /deputydex.
        expect(screen.getByRole("link", { name: /Mathilde Panot/ })).toHaveAttribute("href", "/deputes/PA1");
        expect(screen.getByText("Présidente du groupe")).toBeInTheDocument();

        await user.click(lfi);
        expect(lfi).toHaveAttribute("aria-pressed", "false");
        expect(screen.getByText("81 sièges")).toBeInTheDocument();
    });

    it("is operable with the keyboard (Enter / Space)", async () => {
        const user = userEvent.setup();
        render(<Harness />);

        await user.tab();
        await user.keyboard("{Enter}");
        expect(screen.getByRole("button", { name: "La France insoumise : 71 sièges" })).toHaveAttribute("aria-pressed", "true");

        await user.tab();
        await user.keyboard(" ");
        expect(screen.getByRole("button", { name: "Non inscrits : 10 sièges" })).toHaveAttribute("aria-pressed", "true");
    });

    it("encodes the group code in the /deputydex link", () => {
        expect(hemicycleDeputesHref("NI-17")).toBe("/deputydex?groupe=NI-17");
        expect(hemicycleDeputesHref("A&B")).toBe("/deputydex?groupe=A%26B");
    });
});
