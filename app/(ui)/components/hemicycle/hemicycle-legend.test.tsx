import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { HemicycleLegend } from "@/app/(ui)/components/hemicycle/hemicycle-legend";
import { HemicycleDetail, hemicycleDeputesHref } from "@/app/(ui)/components/hemicycle/hemicycle-detail";
import { HemicycleGroupe } from "@/app/(ui)/_shared/adapter/hemicycle.adapter";

const GROUPES: HemicycleGroupe[] = [
    {
        code: "LFI-NFP", shortLabel: "LFI-NFP", label: "La France insoumise", count: 71, membres: [],
        presidence: "Présidente du groupe : Mathilde Panot", presidentFullName: "Mathilde Panot",
        presidentRole: "Présidente du groupe",
        president: { deputeUID: "PA1", deputeFullName: "Mathilde Panot", deputeGroupeCode: "LFI-NFP", deputeImage: "/img/PA1.png" },
    },
    {
        code: "NI-17", shortLabel: "NI", label: "Non inscrits", count: 10, membres: [],
        presidence: null, presidentFullName: null, presidentRole: null, president: null,
    },
];

function Harness({ total = 81 }: { total?: number }) {
    const [selected, setSelected] = useState<string[]>([]);
    return (
        <>
            <HemicycleLegend
                groupes={GROUPES}
                selectedCodes={selected}
                onToggleAction={(code) => setSelected((cur) => (cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code]))}
            />
            <HemicycleDetail groupes={GROUPES.filter((g) => selected.includes(g.code))} total={total} onClearAction={() => setSelected([])} />
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

    it("coalition : plusieurs groupes cumulent leurs sièges et se comparent à la majorité absolue", async () => {
        const user = userEvent.setup();
        render(<Harness total={577} />);

        await user.click(screen.getByRole("button", { name: "La France insoumise : 71 sièges" }));
        await user.click(screen.getByRole("button", { name: "Non inscrits : 10 sièges" }));

        expect(screen.getByText("81 sièges")).toBeInTheDocument();
        expect(screen.getByText("Coalition LFI-NFP + NI")).toBeInTheDocument();
        expect(screen.getByText("14,0 % des 577 sièges pourvus")).toBeInTheDocument();
        expect(screen.getByText("Majorité absolue : 289 sièges requis, il en manque 208.")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Effacer la sélection" }));
        expect(screen.getByText("577 sièges")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "La France insoumise : 71 sièges" })).toHaveAttribute("aria-pressed", "false");
    });

    it("coalition majoritaire : sièges en plus de la majorité", async () => {
        const user = userEvent.setup();
        render(<Harness total={81} />);

        await user.click(screen.getByRole("button", { name: "La France insoumise : 71 sièges" }));
        await user.click(screen.getByRole("button", { name: "Non inscrits : 10 sièges" }));

        expect(screen.getByText("Majorité absolue atteinte : 41 sièges requis, 40 de plus.")).toBeInTheDocument();
    });

    it("encodes the group code in the /deputydex link", () => {
        expect(hemicycleDeputesHref("NI-17")).toBe("/deputydex?groupe=NI-17");
        expect(hemicycleDeputesHref("A&B")).toBe("/deputydex?groupe=A%26B");
    });
});
