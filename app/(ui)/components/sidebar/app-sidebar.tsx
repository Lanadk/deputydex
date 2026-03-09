"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Users, Vote, BarChart3, Layers, Sword, PanelLeftOpen, PanelLeftClose, Menu, Component} from "lucide-react";
import {useSidebar} from "@/app/(ui)/providers/sidebar-provider";
import {ButtonLib} from "@/app/(ui)/component-library/atoms/button/button-lib";
import {SpanLib} from "@/app/(ui)/component-library/atoms/span/span-lib";
import Tooltip from "@mui/material/Tooltip";


const NAV = [
    {label: "DeputeDex", href: "/deputydex", icon: Sword, section: "deputydex"},
    {label: "Députés", href: "/globaldb/deputies", icon: Users, section: "globaldb"},
    {label: "Groupes", href: "/globaldb/groups", icon: Layers, section: "globaldb"},
    {label: "Votes", href: "/globaldb/votes", icon: Vote, section: "globaldb"},
    {label: "Statistiques", href: "/globaldb/statistics", icon: BarChart3, section: "globaldb"},
    {label: "Lib component", href: "/component-library", icon: Component, section: "component-library"},
];

export default function AppSidebar() {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    const {isOpen, toggle} = useSidebar();
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const activeItem = NAV.find(item => pathname.startsWith(item.href));
    const sectionLabel = activeItem?.label ?? "DeputeDex";

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        if (isMobile && isOpen) toggle();
    }, [isMobile]);

    return (
        <>
            {/* Bandeau mobile */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 z-40 bg-surface-2 border-b border-main flex items-center px-4 gap-3">
                <ButtonLib
                    icon={Menu}
                    variant="tertiary"
                    size="small"
                    onClick={toggle}
                />
                <SpanLib className="text-sm font-semibold">{sectionLabel}</SpanLib>
            </div>

            <aside className={`fixed left-0 top-0 h-full z-50 bg-surface-2 border-r border-main
                      transition-[width,transform] duration-300 ease-in-out flex flex-col
                      ${isOpen ? "w-56 shadow-2xl translate-x-0" : "w-14 -translate-x-full lg:translate-x-0"}`}>
                {/* Bouton toggle */}
                <div className="h-14 flex items-center shrink-0 border-b border-main px-2">
                    {isOpen && (
                        <SpanLib
                            className="flex-1 font-bold text-sm tracking-widest uppercase px-2"
                            style={{ animation: "fadeIn 0.15s ease 0.15s both" }}
                        >
                            DeputyDex
                        </SpanLib>
                    )}
                    <ButtonLib
                        icon={isOpen ? PanelLeftClose : PanelLeftOpen}
                        variant="tertiary"
                        size="small"
                        onClick={toggle}
                    />
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1 p-2 flex-1 pt-3">
                    {NAV.map((item, i) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);
                        const showSeparator = i > 0 && NAV[i - 1].section !== item.section;

                        return (
                            <div key={item.href}>
                                {showSeparator && (
                                    <div className="h-8 flex items-center px-3">
                                        <div className="w-full h-px"/>
                                    </div>
                                )}
                                <Tooltip
                                    title={!isOpen && activeTooltip !== item.href ? item.label : ''}
                                    disableFocusListener
                                    disableTouchListener
                                    classes={{ tooltip: `tooltip-lib` }}
                                    placement="right"
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => {
                                            setActiveTooltip(item.href);
                                            if (isMobile) toggle();
                                        }}
                                        onMouseEnter={() => setActiveTooltip(null)}
                                        className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg sidebar-link
                                                ${isActive ? "sidebar-link--active" : ""}`}
                                    >
                                        <Icon className="w-5 h-5 shrink-0"/>

                                        {isOpen && (
                                            <SpanLib
                                                className="whitespace-nowrap overflow-hidden"
                                                style={{animation: "fadeIn 0.15s ease 0.15s both"}}
                                            >
                                                {item.label}
                                            </SpanLib>
                                        )}
                                    </Link>
                                </Tooltip>
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* Backdrop mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40"
                    onClick={toggle}
                />
            )}

            {/* Spacer desktop */}
            <div className={`hidden lg:block shrink-0 transition-[width] duration-300 ${isOpen ? "w-56" : "w-14"}`}/>
        </>
    );
}