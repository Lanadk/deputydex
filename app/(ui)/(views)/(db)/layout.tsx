import { LegislatureSelector } from "@/app/(ui)/components/legislature-selector/legislature-selector";

/*
 * Pas de `loading.tsx` dans ce segment, volontairement (#121) : son fallback
 * démarre le streaming avant que les fiches (`deputes/[uid]`, `groupes/[code]`,
 * `scrutins/[uid]`) aient pu appeler `notFound()`, ce qui fige le statut HTTP à
 * 200 au lieu de 404 (mesuré). Les fiches affichent déjà leur propre spinner
 * côté client pendant le chargement des sections.
 */

export default function DBLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LegislatureSelector />
            {children}
        </>
    );
}