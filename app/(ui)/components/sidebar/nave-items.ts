import {BarChart3, Component, Layers, Sword, Users, Vote, HandHelping, MessageCircleMore, Database} from "lucide-react";

export const NAVITEMS = [
    {label: "DeputeDex", href: "/deputydex", icon: Sword, section: "deputydex"},
    {label: "Députés", href: "/db/deputies", icon: Users, section: "db"},
    {label: "Groupes", href: "/db/groups", icon: Layers, section: "db"},
    {label: "Votes", href: "/db/votes", icon: Vote, section: "db"},
    {label: "Statistiques", href: "/db/statistics", icon: BarChart3, section: "db"},
    {label: "Data Sources", href: "/info/data-sources", icon: Database, section: "info"},
    {label: "About us", href: "/info/about-us", icon: MessageCircleMore, section: "info"},
    {label: "Donations", href: "/donations", icon: HandHelping, section: "info"},
    {label: "Lib component", href: "/component-library", icon: Component, section: "component-library"}, // dev only , faudra couper la route en prod
];