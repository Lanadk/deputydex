import type { Metadata } from "next";
import Link from "next/link";
import { PageStateLib } from "@/app/(ui)/component-library/molecules/page-state/page-state-lib";

export const metadata: Metadata = {
    title: "Page introuvable",
};

/**
 * 404 maison : URL inconnue, ou `notFound()` appelé par une page (député,
 * groupe ou scrutin inexistant). Rendue dans le layout racine, sidebar comprise.
 */
export default function NotFound() {
    return (
        <PageStateLib
            code="404"
            title="Page introuvable"
            description="Cette page n'existe pas, ou le député, le groupe ou le scrutin demandé n'est pas dans nos données."
        >
            <Link href="/" className="btn-lib btn-lib--primary btn-lib--medium">Accueil</Link>
            <Link href="/deputydex" className="btn-lib btn-lib--secondary btn-lib--medium">Les députés</Link>
            <Link href="/groupes" className="btn-lib btn-lib--secondary btn-lib--medium">Les groupes</Link>
            <Link href="/scrutins" className="btn-lib btn-lib--secondary btn-lib--medium">Les scrutins</Link>
        </PageStateLib>
    );
}
