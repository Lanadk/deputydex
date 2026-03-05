"use client";

import React from "react";
import { ButtonLib } from "@/app/component-library/atoms/button/button-lib";
import { SpanLib } from "@/app/component-library/atoms/span/span-lib";
import { ApplyMode } from "../filter-bar.types";

interface FilterBarActionsProps {
    applyMode: ApplyMode;
    hasPendingChanges: boolean;

    onApply: () => void;
    onReset: () => void;

    applyLabel?: string;
    resetLabel?: string;
}

export const FilterBarActions: React.FC<FilterBarActionsProps> = ({
                                                                      applyMode,
                                                                      hasPendingChanges,
                                                                      onApply,
                                                                      onReset,
                                                                      applyLabel = "Appliquer",
                                                                      resetLabel = "Réinitialiser",
                                                                  }) => {
    return (
        <div className="fb-actions">
            <ButtonLib
                text={applyLabel}
                size="small"
                variant="primary"
                onClick={onApply}
                type="button"
                disabled={applyMode === "manual" ? !hasPendingChanges : false}
            />

            <ButtonLib
                text={resetLabel}
                size="small"
                variant="tertiary"
                onClick={onReset}
                type="button"
            />

            {applyMode === "manual" && (
                <SpanLib className="fb-actions__hint">
                    {hasPendingChanges ? "Modifications non appliquées" : " "}
                </SpanLib>
            )}
        </div>
    );
};