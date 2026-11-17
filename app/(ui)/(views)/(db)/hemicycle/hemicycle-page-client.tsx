"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLegislature } from "@/app/(ui)/providers/legislature-provider";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { buildHemicycleGroupes, HemicycleGroupe } from "@/app/(ui)/_shared/adapter/hemicycle.adapter";
import { computeHemicycleSeats } from "@/app/(ui)/components/hemicycle/hemicycle-seats";
import { HemicyclePlan } from "@/app/(ui)/components/hemicycle/hemicycle-plan";
import { HemicycleLegend } from "@/app/(ui)/components/hemicycle/hemicycle-legend";
import { HemicycleDetail } from "@/app/(ui)/components/hemicycle/hemicycle-detail";
import { SpinnerLib } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";

type LoadState = { legislature: number; groupes: HemicycleGroupe[] } | { legislature: number; error: true };

export default function HemicyclePageClient() {
    const { legislature } = useLegislature();
    const legislatureNum = legislature?.number;

    const [state, setState] = useState<LoadState | null>(null);
    const [selection, setSelection] = useState<{ legislature: number; code: string } | null>(null);

    useEffect(() => {
        if (!legislatureNum) return;
        let cancelled = false;
        Promise.all([
            deputesGateway.getDeputesCards(legislatureNum),
            // Les présidences ne sont qu'un complément : si les cartes de groupe
            // échouent, on affiche quand même l'hémicycle (effectifs = cartes députés).
            groupesGateways.getGroupesCards(legislatureNum).catch((e) => {
                console.error(e);
                return [];
            }),
        ])
            .then(([deputes, groupes]) => {
                if (!cancelled) setState({ legislature: legislatureNum, groupes: buildHemicycleGroupes(deputes, groupes) });
            })
            .catch((e) => {
                console.error(e);
                if (!cancelled) setState({ legislature: legislatureNum, error: true });
            });
        return () => {
            cancelled = true;
        };
    }, [legislatureNum]);

    // Données / sélection d'une autre législature = encore en chargement / pas de sélection.
    const current = state && state.legislature === legislatureNum ? state : null;
    const groupes = useMemo(() => (current && "groupes" in current ? current.groupes : []), [current]);
    const selectedCode = selection && selection.legislature === legislatureNum ? selection.code : null;
    const selectedGroupe = groupes.find((g) => g.code === selectedCode) ?? null;

    const seats = useMemo(() => computeHemicycleSeats(groupes), [groupes]);

    const toggle = (code: string) => {
        if (!legislatureNum) return;
        setSelection(selectedCode === code ? null : { legislature: legislatureNum, code });
    };

    return (
        <div className="hemicycle-page">
            <header className="hemicycle-header">
                {legislatureNum && <span className="page-pill">{legislatureNum}ème législature</span>}
                <h1>L&apos;hémicycle</h1>
                <p className="subtitle">
                    Chaque carte est un siège, regroupé par groupe parlementaire. Choisis un groupe pour le
                    mettre en relief.
                </p>
            </header>

            {!current ? (
                <div className="flex items-center justify-center h-64">
                    <SpinnerLib />
                </div>
            ) : "error" in current ? (
                <div className="flex items-center justify-center h-32">
                    <SpanLib className="text-subtitle-accent">Impossible de charger l&apos;hémicycle.</SpanLib>
                </div>
            ) : (
                <>
                    <HemicyclePlan key={current.legislature} seats={seats} selectedCode={selectedCode} />
                    <section className="hemicycle-panel">
                        <HemicycleLegend groupes={groupes} selectedCode={selectedCode} onToggleAction={toggle} />
                        <HemicycleDetail groupe={selectedGroupe} total={seats.length} />
                    </section>
                </>
            )}
        </div>
    );
}
