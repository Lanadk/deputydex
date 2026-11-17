import {Armchair, BarChart3, Component, House, Layers, Grid3x3, HandHelping, MessageCircleMore, Database, Scale, GitPullRequest} from "lucide-react";

export const NAVITEMS = [
    {label: "Accueil", href: "/", icon: House, section: "deputydex"},
    {label: "DeputeDex", href: "/deputydex", icon: Grid3x3, section: "deputydex"},
    {label: "Groupes", href: "/groupes", icon: Layers, section: "deputydex"},
    {label: "Hémicycle", href: "/hemicycle", icon: Armchair, section: "deputydex"},
    {label: "Statistiques", href: "/statistics", icon: BarChart3, section: "deputydex"}, //TODO V2
    {label: "Data Sources", href: "/data-sources", icon: Database, section: "info"},
    {label: "About us", href: "/about-us", icon: MessageCircleMore, section: "info"},
    {label: "Contribuer", href: "/contribute", icon: GitPullRequest, section: "info"},
    {label: "Mentions légales", href: "/mentions-legales", icon: Scale, section: "legal-notice"},
    //{label: "Donations", href: "/donations", icon: HandHelping, section: "info"}, //TODO V2
    // Visible uniquement en dev : la route elle-même est bloquée en prod
    // par un notFound() côté serveur dans component-library/layout.tsx.
    ...(process.env.NODE_ENV !== "production"
        ? [{label: "Lib component", href: "/component-library", icon: Component, section: "component-library"}]
        : []),
];

/** L'accueil ("/") n'est actif que sur "/" : avec `startsWith`, il serait actif sur toutes les pages. */
export function isNavItemActive(href: string, pathname: string): boolean {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
}