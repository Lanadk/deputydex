import {BarChart3, Component, Layers, Grid3x3, HandHelping, MessageCircleMore, Database} from "lucide-react";

export const NAVITEMS = [
    {label: "DeputeDex", href: "/deputydex", icon: Grid3x3, section: "deputydex"},
    {label: "Groupes", href: "/groupes", icon: Layers, section: "db"},
    {label: "Statistiques", href: "/statistics", icon: BarChart3, section: "db"},
    {label: "Data Sources", href: "/data-sources", icon: Database, section: "info"},
    {label: "About us", href: "/about-us", icon: MessageCircleMore, section: "info"},
    //{label: "Donations", href: "/donations", icon: HandHelping, section: "info"}, //TODO V2
    // Visible uniquement en dev : la route elle-même est bloquée en prod
    // par un notFound() côté serveur dans component-library/layout.tsx.
    ...(process.env.NODE_ENV !== "production"
        ? [{label: "Lib component", href: "/component-library", icon: Component, section: "component-library"}]
        : []),
];