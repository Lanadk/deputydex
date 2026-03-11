"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {ParagraphItem} from "@/app/(ui)/component-library/template/block-section/block-section-renderer";

interface BlockParagraphRendererProps {
    items: ParagraphItem[];
}

/**
 * BlockParagraphRenderer
 * Rendu d'un block paragraphe déclaratif.
 * Supporte : text, highlight, list, kpi.
 */
export const BlockParagraphRenderer: React.FC<BlockParagraphRendererProps> = ({ items }) => {
    return (
        <div
            className="chart-lib flex flex-col gap-4"
        >
            {items.map((item, i) => {
                switch (item.type) {

                    case "text":
                        return (
                            <p
                                key={i}
                                className="text-sm leading-relaxed"
                                style={{ color: "var(--foreground)" }}
                            >
                                {item.content}
                            </p>
                        );

                    case "highlight":
                        return (
                            <div
                                key={i}
                                className="px-4 py-3 rounded-lg border-l-2 text-sm leading-relaxed"
                                style={{
                                    borderColor: "var(--accent)",
                                    backgroundColor: "var(--surface-3)",
                                    color: "var(--foreground)",
                                }}
                            >
                                {item.content}
                            </div>
                        );

                    case "list":
                        return (
                            <ul key={i} className="flex flex-col gap-1.5">
                                {item.items.map((li, j) => (
                                    <li
                                        key={j}
                                        className="flex items-start gap-2 text-sm"
                                        style={{ color: "var(--foreground)" }}
                                    >
                                        <span
                                            className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                                            style={{ backgroundColor: "var(--accent)" }}
                                        />
                                        {li}
                                    </li>
                                ))}
                            </ul>
                        );

                    case "kpi":
                        const TrendIcon =
                            item.trend === "up" ? TrendingUp
                                : item.trend === "down" ? TrendingDown
                                    : item.trend === "neutral" ? Minus
                                        : null;

                        const trendColor =
                            item.trend === "up" ? "var(--accent)"
                                : item.trend === "down" ? "var(--accent-danger)"
                                    : "var(--subtitle-accent)";

                        return (
                            <div
                                key={i}
                                className="flex items-center justify-between gap-4 py-3 border-b border-main last:border-0"
                            >
                                <span
                                    className="text-sm"
                                    style={{ color: "var(--subtitle-accent)" }}
                                >
                                    {item.label}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span
                                        className="text-xl font-bold"
                                        style={{ color: "var(--foreground)" }}
                                    >
                                        {item.value}
                                    </span>
                                    {TrendIcon && (
                                        <div className="flex items-center gap-1">
                                            <TrendIcon
                                                className="w-3.5 h-3.5"
                                                style={{ color: trendColor }}
                                            />
                                            {item.trendLabel && (
                                                <span
                                                    className="text-xs font-medium"
                                                    style={{ color: trendColor }}
                                                >
                                                    {item.trendLabel}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                }
            })}
        </div>
    );
};