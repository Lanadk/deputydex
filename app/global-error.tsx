"use client"; // Les error boundaries sont des Client Components.

import "./globals.css";
import { useEffect } from "react";
import Link from "next/link";
import { PageStateLib } from "@/app/(ui)/component-library/molecules/page-state/page-state-lib";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";

/**
 * Erreur dans le layout racine lui-même : ce fichier REMPLACE le layout
 * (d'où <html>/<body> et l'import de globals.css). Le thème choisi par
 * l'utilisateur (next-themes) n'est pas disponible ici : thème clair par défaut.
 */
export default function GlobalError({
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
        <html lang="fr">
            <body className="antialiased">
                <title>Erreur | Députédex</title>
                <PageStateLib
                    title="Une erreur est survenue"
                    description={
                        <>
                            Le site n&apos;a pas pu s&apos;afficher. Réessayez dans un instant.
                            {error.digest && <><br /><small>Référence : {error.digest}</small></>}
                        </>
                    }
                >
                    <ButtonLib text="Réessayer" onClick={() => retry()} />
                    <Link href="/" className="btn-lib btn-lib--secondary btn-lib--medium">Accueil</Link>
                </PageStateLib>
            </body>
        </html>
    );
}
