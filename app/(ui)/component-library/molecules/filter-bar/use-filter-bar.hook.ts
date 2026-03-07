"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ActiveFieldFilter, FilterBarQuery, FilterField } from "./filter-bar.types";
import { buildQuery } from "./filter-bar.query";
import {FilterBarProps} from "@/app/(ui)/component-library/molecules/filter-bar/filter-bar";


const EMPTY_QUERY: FilterBarQuery = { orderBy: [], where: {} };

export function useFilterBar(props: FilterBarProps) {
    const {
        sortOptions = [],
        filterFields = [],
        onQueryChange,
        onDraftChange,
        applyMode = "auto",
        defaultQuery = EMPTY_QUERY,
    } = props;

    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeFieldFilters, setActiveFieldFilters] = useState<Record<string, ActiveFieldFilter>>(
        {}
    );
    const [visibleFields, setVisibleFields] = useState<string[]>([]);

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