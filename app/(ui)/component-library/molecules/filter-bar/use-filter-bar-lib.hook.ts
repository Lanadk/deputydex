"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ActiveFieldFilter, FilterBarQuery, FilterField } from "@/app/_shared/filtering/filter-bar.types";
import { buildQuery } from "./filter-bar-lib.query";
import {FilterBarProps} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar-lib";


const EMPTY_QUERY: FilterBarQuery = { orderBy: [], where: {} };

function parseDefaultQuery(
    defaultQuery: FilterBarQuery,
    sortOptions: FilterBarProps["sortOptions"] = [],
) {
    let activeId: string | null = null;
    const activeFieldFilters: Record<string, ActiveFieldFilter> = {};
    const visibleFields: string[] = [];

    const firstOrder = defaultQuery.orderBy?.[0];
    if (firstOrder) {
        const field = Object.keys(firstOrder)[0];
        const direction = firstOrder[field as keyof typeof firstOrder];

        const foundSort = sortOptions.find(
            (option) =>
                option.field === field && option.direction === direction
        );

        if (foundSort) {
            activeId = foundSort.id;
        }
    }

    const where = defaultQuery.where as any;
    const conditions = Array.isArray(where?.AND) ? where.AND : where && Object.keys(where).length > 0 ? [where] : [];

    for (const condition of conditions) {
        const field = Object.keys(condition ?? {})[0];
        if (!field) continue;

        const operation = condition[field];
        const operator = Object.keys(operation ?? {})[0];
        const value = operation?.[operator];

        if (!operator) continue;

        activeFieldFilters[field] = { operator, value };

        if (!visibleFields.includes(field)) {
            visibleFields.push(field);
        }
    }

    return {
        activeId,
        activeFieldFilters,
        visibleFields,
    };
}

export function useFilterBar(props: FilterBarProps) {
    const {
        sortOptions = [],
        filterFields = [],
        onQueryChange,
        onDraftChange,
        applyMode = "auto",
        defaultQuery = EMPTY_QUERY,
    } = props;

    const initialState = useMemo(
        () => parseDefaultQuery(defaultQuery, sortOptions),
        [defaultQuery, sortOptions]
    );

    const [activeId, setActiveId] = useState<string | null>(initialState.activeId);
    const [activeFieldFilters, setActiveFieldFilters] = useState<Record<string, ActiveFieldFilter>>(
        initialState.activeFieldFilters
    );
    const [visibleFields, setVisibleFields] = useState<string[]>(initialState.visibleFields);

    // seulement utile pour le mode manual (mais on garde le state toujours, sans l'updater en effect)
    const [appliedQuery, setAppliedQuery] = useState<FilterBarQuery>(defaultQuery);

    const handleSortClick = useCallback((id: string) => {
        setActiveId((prev) => (prev === id ? null : id));
    }, []);

    const handleFieldChange = useCallback((field: string, value: ActiveFieldFilter | null) => {
        setActiveFieldFilters((prev) => {
            const next = { ...prev };
            if (value === null) delete next[field];
            else next[field] = value;
            return next;
        });
    }, []);

    const handleAddField = useCallback((field: string) => {
        setVisibleFields((prev) => [...prev, field]);
    }, []);

    const handleRemoveField = useCallback((field: string) => {
        setVisibleFields((prev) => prev.filter((f) => f !== field));
        setActiveFieldFilters((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const draftQuery = useMemo(
        () => buildQuery(activeId, sortOptions, activeFieldFilters),
        [activeId, sortOptions, activeFieldFilters]
    );

    const onQueryChangeRef = useRef(onQueryChange);
    const onDraftChangeRef = useRef(onDraftChange);

    useEffect(() => {
        onQueryChangeRef.current = onQueryChange;
    }, [onQueryChange]);

    useEffect(() => {
        onDraftChangeRef.current = onDraftChange;
    }, [onDraftChange]);

    useEffect(() => {
        onDraftChangeRef.current?.(draftQuery);

        if (applyMode === "auto") {
            // en auto, la query effective = draft
            onQueryChangeRef.current(draftQuery);
        }
    }, [draftQuery, applyMode]);

    // query utilisée par le consumer (utile pour afficher un badge “pending”)
    const effectiveQuery = applyMode === "auto" ? draftQuery : appliedQuery;

    const apply = useCallback(() => {
        // en auto, apply ne sert à rien (mais on le laisse sans side effect)
        if (applyMode === "manual") {
            setAppliedQuery(draftQuery);
            onQueryChangeRef.current(draftQuery);
        }
    }, [applyMode, draftQuery]);

    const reset = useCallback(() => {
        setActiveId(null);
        setActiveFieldFilters({});
        setVisibleFields([]);

        // reset applied query pour le mode manual
        setAppliedQuery(defaultQuery);

        // en auto on push aussi la query par défaut
        if (applyMode === "auto") {
            onQueryChangeRef.current(defaultQuery);
        } else {
            onDraftChangeRef.current?.(defaultQuery);
        }
    }, [applyMode, defaultQuery]);

    const hasPendingChanges = useMemo(() => {
        if (applyMode === "auto") return false;
        return JSON.stringify(draftQuery) !== JSON.stringify(appliedQuery);
    }, [applyMode, draftQuery, appliedQuery]);

    const visibleFieldDefs: FilterField[] = visibleFields
        .map((f) => filterFields.find((ff) => ff.field === f))
        .filter((f): f is FilterField => f !== undefined);

    return {
        activeId,
        activeFieldFilters,
        visibleFields,
        visibleFieldDefs,
        sortOptions,
        filterFields,
        handleSortClick,
        handleFieldChange,
        handleAddField,
        handleRemoveField,
        applyMode,
        draftQuery,
        appliedQuery,
        effectiveQuery,
        hasPendingChanges,
        apply,
        reset,
    };
}