"use client";

import React from "react";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

export function FilterBarSectionLib({
                                     title,
                                     children,
                                 }: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="fb-section">
            <SpanLib className="fb-section__title">{title}</SpanLib>
            {children}
        </div>
    );
}