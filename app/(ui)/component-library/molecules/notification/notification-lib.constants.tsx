"use client";

import React from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { NotificationLib, useNotifications } from "@/app/(ui)/component-library/molecules/notification/notification-lib";

const noop = () => {};

const CODE_SETUP = `// Une fois, dans le layout racine
<NotificationProvider>{children}</NotificationProvider>

// Dans un composant
const { notify } = useNotifications();
notify({ message: "Impossible de charger les législatures.", variant: "error",
         action: { label: "Réessayer", onClick: retry } });
`;

const CODE_VARIANTS = `<NotificationLib notification={{ id: 1, message: "…", variant: "error", duration: 0 }} onDismiss={dismiss} />
// variant : "error" | "warning" | "success" | "info"
`;

/** Boutons qui déclenchent de vraies notifications (provider du layout racine). */
function NotifyDemo() {
    const { notify } = useNotifications();
    return (
        <div className="flex flex-wrap gap-2">
            <ButtonLib
                text="Erreur avec « Réessayer »"
                size="small"
                onClick={() => notify({
                    message: "Impossible de charger les législatures.",
                    variant: "error",
                    action: { label: "Réessayer", onClick: noop },
                })}
            />
            <ButtonLib
                text="Avertissement"
                size="small"
                variant="secondary"
                onClick={() => notify({ message: "Les législatures disponibles n'ont pas pu être vérifiées.", variant: "warning" })}
            />
            <ButtonLib
                text="Succès"
                size="small"
                variant="tertiary"
                onClick={() => notify({ message: "Référence enregistrée.", variant: "success" })}
            />
        </div>
    );
}

const sample = (id: number, variant: "error" | "warning" | "success" | "info", message: string, withAction = false) => (
    <NotificationLib
        notification={{ id, variant, message, duration: 0, action: withAction ? { label: "Réessayer", onClick: noop } : undefined }}
        onDismiss={noop}
    />
);

export const getNotificationSections = () => [
    {
        title: "Déclencher une notification (useNotifications)",
        code: CODE_SETUP,
        component: <NotifyDemo />,
    },
    {
        title: "Variantes : erreur (avec action), avertissement, succès, information",
        code: CODE_VARIANTS,
        component: (
            <div className="flex max-w-sm flex-col gap-2">
                {sample(1, "error", "Impossible de charger les législatures.", true)}
                {sample(2, "warning", "Les législatures disponibles n'ont pas pu être vérifiées.")}
                {sample(3, "success", "Référence enregistrée.")}
                {sample(4, "info", "Nouvelles données disponibles.")}
            </div>
        ),
    },
];
