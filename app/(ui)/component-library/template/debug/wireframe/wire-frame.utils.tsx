import React from "react";

export const WireBox = ({
                     label,
                     height = "h-8",
                     color = "bg-surface-2",
                     textColor = "text-subtitle",
                     className = "",
                     children,
                 }: {
    label?: string;
    height?: string;
    color?: string;
    textColor?: string;
    className?: string;
    children?: React.ReactNode;
}) => (
    <div
        className={`${height} ${color} ${className} rounded flex items-center justify-center border border-main`}
        style={{ borderStyle: "dashed" }}
    >
        {children ?? (
            <span className={`text-xs font-mono ${textColor}`} style={{ color: "var(--subtitle-accent)" }}>
                {label}
            </span>
        )}
    </div>
);

export const WireLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--surface-3)", color: "var(--accent)" }}>
        {children}
    </span>
);