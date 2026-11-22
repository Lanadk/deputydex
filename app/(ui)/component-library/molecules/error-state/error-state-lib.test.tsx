import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DEFAULT_ERROR_MESSAGE, ErrorStateLib } from "@/app/(ui)/component-library/molecules/error-state/error-state-lib";

describe("ErrorStateLib", () => {
    it("annonce l'erreur (role alert) avec le message par défaut", () => {
        render(<ErrorStateLib />);

        expect(screen.getByRole("alert")).toHaveTextContent(DEFAULT_ERROR_MESSAGE);
    });

    it("affiche le message fourni", () => {
        render(<ErrorStateLib message="Impossible de charger les députés." />);

        expect(screen.getByRole("alert")).toHaveTextContent("Impossible de charger les députés.");
    });

    it("propose « Réessayer » quand onRetry est fourni, et le relance au clic", () => {
        const onRetry = jest.fn();
        render(<ErrorStateLib onRetry={onRetry} />);

        fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));

        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("sans onRetry, aucun bouton", () => {
        render(<ErrorStateLib />);

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
});
