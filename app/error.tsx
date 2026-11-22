"use client"; // Les error boundaries sont des Client Components.

import { useEffect } from "react";
import Link from "next/link";
import { PageStateLib } from "@/app/(ui)/component-library/molecules/page-state/page-state-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";

/**
 * Erreur levée pendant le rendu d'une page : remplace la page, le layout
 * racine (sidebar) reste affiché. `retry()` (Next 16) recharge les données du
 * segment puis le réaffiche ; `reset()` ne ferait que le réafficher.
 */
export default function ErrorPage({
    error,
    retry,
}: {
    error: Error & { digest?: string };
    retry: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <PageStateLib
            title="Une erreur est survenue"
            description={
                <>
                    Le chargement de cette page a échoué. Réessayez dans un instant.
                    {error.digest && <><br /><small>Référence : {error.digest}</small></>}
                </>
            }
        >
            <ButtonLib text="Réessayer" onClick={() => retry()} />
            <Link href="/" className="btn-lib btn-lib--secondary btn-lib--medium">Accueil</Link>
        </PageStateLib>
    );
}
