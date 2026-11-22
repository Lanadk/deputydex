import React from "react";
import { ErrorStateLib } from "@/app/(ui)/component-library/molecules/error-state/error-state-lib";

const CODE_DEFAULT = `<ErrorStateLib onRetry={retry} />
`;

const CODE_MESSAGE = `<ErrorStateLib
  message="Impossible de charger les députés pour le moment."
  onRetry={retry}
/>
`;

const CODE_NO_RETRY = `<ErrorStateLib message="Date de mise à jour indisponible." />
`;

const noop = () => {};

export const getErrorStateSections = () => [
    {
        title: "Par défaut — message générique et bouton « Réessayer »",
        code: CODE_DEFAULT,
        component: <ErrorStateLib onRetry={noop} />,
    },
    {
        title: "Message propre au contenu",
        code: CODE_MESSAGE,
        component: <ErrorStateLib message="Impossible de charger les députés pour le moment." onRetry={noop} />,
    },
    {
        title: "Sans nouvel essai possible",
        code: CODE_NO_RETRY,
        component: <ErrorStateLib message="Date de mise à jour indisponible." />,
    },
];
