"use client";

import React from "react";
import { cn } from "@/app/(ui)/lib/cn";


export const CardHoloOverlay: React.FC = ({ }) => {
    return (
        <div
            className={cn(
                "card-holo-overlay absolute inset-0 pointer-events-none",
            )}
        />
    );
};