"use client";

import React from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

type Props = {
    page: number;
    pageCount: number;
    total?: number;
    loading?: boolean;

    onPrevAction: () => void;
    onNextAction: () => void;
};

export function TablePaginationLib({
                                       page,
                                       pageCount,
                                       total,
                                       loading,
                                       onPrevAction,
                                       onNextAction,
                                   }: Props) {
    return (
        <div className="table-pagination">
            <ButtonLib
                text="Précédent"
                size="small"
                variant="secondary"
                onClick={onPrevAction}
                type="button"
                disabled={page <= 1 || !!loading}
            />

            <SpanLib className="table-pagination__info">
                Page {page} / {pageCount}
                {typeof total === "number" ? ` — ${total} résultat(s)` : ""}
                {loading ? " — chargement..." : ""}
            </SpanLib>

            <ButtonLib
                text="Suivant"
                size="small"
                variant="secondary"
                onClick={onNextAction}
                type="button"
                disabled={page >= pageCount || !!loading}
            />
        </div>
    );
}