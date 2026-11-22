import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    DEFAULT_NOTIFICATION_DURATION_MS,
    NotificationInput,
    NotificationProvider,
    useNotifications,
} from "@/app/(ui)/component-library/molecules/notification/notification-lib";

function Trigger({ input }: { input: NotificationInput }) {
    const { notify } = useNotifications();
    return <button type="button" onClick={() => notify(input)}>Notifier</button>;
}

const renderWith = (input: NotificationInput) =>
    render(<NotificationProvider><Trigger input={input} /></NotificationProvider>);

describe("NotificationLib", () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it("affiche une erreur (role alert), puis la retire après sa durée", () => {
        renderWith({ message: "Chargement impossible.", variant: "error" });

        fireEvent.click(screen.getByText("Notifier"));
        expect(screen.getByRole("alert")).toHaveTextContent("Chargement impossible.");

        act(() => jest.advanceTimersByTime(DEFAULT_NOTIFICATION_DURATION_MS));
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("une information est annoncée poliment (role status)", () => {
        renderWith({ message: "Données à jour." });

        fireEvent.click(screen.getByText("Notifier"));

        expect(screen.getByRole("status")).toHaveTextContent("Données à jour.");
    });

    it("lance l'action puis ferme la notification", () => {
        const onRetry = jest.fn();
        renderWith({ message: "Échec.", variant: "error", action: { label: "Réessayer", onClick: onRetry } });

        fireEvent.click(screen.getByText("Notifier"));
        fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));

        expect(onRetry).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("se ferme avec le bouton « Fermer la notification »", () => {
        renderWith({ message: "Échec.", variant: "error" });

        fireEvent.click(screen.getByText("Notifier"));
        fireEvent.click(screen.getByRole("button", { name: "Fermer la notification" }));

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("suspend la fermeture automatique au survol", () => {
        renderWith({ message: "Échec.", variant: "error" });

        fireEvent.click(screen.getByText("Notifier"));
        fireEvent.mouseEnter(screen.getByRole("alert"));
        act(() => jest.advanceTimersByTime(DEFAULT_NOTIFICATION_DURATION_MS * 2));
        expect(screen.getByRole("alert")).toBeInTheDocument();

        fireEvent.mouseLeave(screen.getByRole("alert"));
        act(() => jest.advanceTimersByTime(DEFAULT_NOTIFICATION_DURATION_MS));
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("n'empile pas deux fois le même message", () => {
        renderWith({ message: "Échec.", variant: "error" });

        fireEvent.click(screen.getByText("Notifier"));
        fireEvent.click(screen.getByText("Notifier"));

        expect(screen.getAllByRole("alert")).toHaveLength(1);
    });

    it("reste affichée tant qu'on ne la ferme pas avec duration: 0", () => {
        renderWith({ message: "Permanent.", variant: "error", duration: 0 });

        fireEvent.click(screen.getByText("Notifier"));
        act(() => jest.advanceTimersByTime(60_000));

        expect(screen.getByRole("alert")).toBeInTheDocument();
    });
});
