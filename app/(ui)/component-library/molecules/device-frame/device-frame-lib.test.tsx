import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DeviceFrameLib } from "@/app/(ui)/component-library/molecules/device-frame/device-frame-lib";

describe("DeviceFrameLib", () => {
    it("affiche le contenu dans l'écran ; le cadre et la barre d'état sont masqués aux lecteurs d'écran", () => {
        const { container } = render(<DeviceFrameLib time="18:30"><p>Contenu</p></DeviceFrameLib>);

        expect(screen.getByText("Contenu").closest(".device-frame__content")).toBeInTheDocument();
        expect(container.querySelector(".device-frame__status")).toHaveAttribute("aria-hidden", "true");
        expect(container.querySelector(".device-frame__time")).toHaveTextContent("18:30");
    });

    it("téléphone par défaut (Dynamic Island) ; tablette : caméra frontale, sans Dynamic Island", () => {
        const { container: phone } = render(<DeviceFrameLib><p>A</p></DeviceFrameLib>);
        expect(phone.firstChild).toHaveClass("device-frame--phone");
        expect(phone.querySelector(".device-frame__island")).toBeInTheDocument();

        const { container: tablet } = render(<DeviceFrameLib device="tablet"><p>B</p></DeviceFrameLib>);
        expect(tablet.firstChild).toHaveClass("device-frame--tablet");
        expect(tablet.querySelector(".device-frame__island")).not.toBeInTheDocument();
        expect(tablet.querySelector(".device-frame__camera")).toBeInTheDocument();
    });
});
