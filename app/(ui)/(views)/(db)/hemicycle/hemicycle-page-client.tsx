"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLegislature } from "@/app/(ui)/providers/legislature-provider";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { groupesGateways } from "@/app/(ui)/gateways/groupes/groupes.gateway";
import { legislaturesGateway } from "@/app/(ui)/gateways/legislatures/legislatures.gateway";
import { useNotifications } from "@/app/(ui)/component-library/molecules/notification/notification-lib";
import {
    buildHemicycleGroupes,
    buildHemicyclePerchoir,
    HemicycleGroupe,
    HemicyclePerchoir,
} from "@/app/(ui)/_shared/adapter/hemicycle.adapter";
import { computeHemicycleSeats } from "@/app/(ui)/components/hemicycle/hemicycle-seats";
import { HemicyclePlan } from "@/app/(ui)/components/hemicycle/hemicycle-plan";
import { HemicycleLegend } from "@/app/(ui)/components/hemicycle/hemicycle-legend";
import { HemicycleDetail } from "@/app/(ui)/components/hemicycle/hemicycle-detail";
import { SpinnerLib } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import { SpanLib } from "@/app/(ui)/component-library/atoms/span/span-lib";
import { HemicycleEchelle, HemicycleModeChoix, ModeHemicycle } from "@/app/(ui)/components/hemicycle/hemicycle-coloration";
import { assignerDeputes, habillerSieges, INDICATEURS_HEMICYCLE } from "@/app/(ui)/components/hemicycle/hemicycle-indicateurs";
import { DeputeIndicateursDTO } from "@/app/domains/presence/dto/depute-indicateurs.dto";

type LoadState =
    | { legislature: number; groupes: HemicycleGroupe[]; perchoir: HemicyclePerchoir | null }
    | { legislature: number; error: true };

type IndicateursCharges = { legislature: number; parUid: Map<string, DeputeIndicateursDTO> };

export default function HemicyclePageClient() {
    const { legislature } = useLegislature();
    const legislatureNum = legislature?.number;
    const { notify } = useNotifications();

    const [state, setState] = useState<LoadState | null>(null);
    const [selection, setSelection] = useState<{ legislature: number; codes: string[] } | null>(null);
    const [mode, setMode] = useState<ModeHemicycle>("groupes");
    const [coalition, setCoalition] = useState(false);
    const [indicateurId, setIndicateurId] = useState<string>(INDICATEURS_HEMICYCLE[0].id);
    const [indicateurs, setIndicateurs] = useState<IndicateursCharges | null>(null);

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
            // Idem pour la présidence de l'Assemblée : sans elle, pas de perchoir (siège dans son groupe).
            legislaturesGateway.getPresidenceAssemblee(legislatureNum).catch(() => {
                if (!cancelled) notify({ message: "La présidence de l'Assemblée n'a pas pu être chargée.", variant: "warning" });
                return null;
            }),
        ])
            .then(([deputes, groupes, presidence]) => {
                if (!cancelled) setState({
                    legislature: legislatureNum,
                    groupes: buildHemicycleGroupes(deputes, groupes),
                    perchoir: buildHemicyclePerchoir(presidence, deputes),
                });
            })
            .catch((e) => {
                console.error(e);
                if (!cancelled) setState({ legislature: legislatureNum, error: true });
            });
        return () => {
            cancelled = true;
        };
    }, [legislatureNum, notify]);

    const indicateur = mode === "stats" ? INDICATEURS_HEMICYCLE.find((i) => i.id === indicateurId) ?? null : null;
    const indicateursCourants = indicateurs && indicateurs.legislature === legislatureNum ? indicateurs.parUid : null;

    // Indicateurs par député : chargés au premier choix d'un indicateur, une fois par législature.
    useEffect(() => {
        if (!indicateur || !legislatureNum || indicateursCourants) return;
        let cancelled = false;
        deputesGateway
            .getDeputesIndicateurs(legislatureNum)
            .then((lignes) => {
                if (!cancelled) setIndicateurs({ legislature: legislatureNum, parUid: new Map(lignes.map((l) => [l.uid, l])) });
            })
            .catch((e) => {
                console.error(e);
                if (cancelled) return;
                notify({ message: "Les indicateurs des députés n'ont pas pu être chargés.", variant: "warning" });
                setMode("groupes");
            });
        return () => {
            cancelled = true;
        };
    }, [indicateur, legislatureNum, indicateursCourants, notify]);

    // Données / sélection d'une autre législature = encore en chargement / pas de sélection.
    const current = state && state.legislature === legislatureNum ? state : null;
    const groupes = useMemo(() => (current && "groupes" in current ? current.groupes : []), [current]);
    const perchoir = current && "perchoir" in current ? current.perchoir : null;
    const selectedCodes = useMemo(
        () => (selection && selection.legislature === legislatureNum ? selection.codes : []),
        [selection, legislatureNum]
    );
    const selectedGroupes = groupes.filter((g) => selectedCodes.includes(g.code));

    const perchoirGroupe = perchoir?.groupeCode ?? null;
    const seats = useMemo(
        () => computeHemicycleSeats(groupes, perchoirGroupe ? { groupeCode: perchoirGroupe } : null),
        [groupes, perchoirGroupe]
    );

    const { habillage, echelle } = useMemo(() => {
        const actif = indicateur && indicateursCourants ? indicateur : null;
        const valeur = actif && indicateursCourants
            ? (uid: string) => {
                const ligne = indicateursCourants.get(uid);
                return ligne ? actif.lire(ligne) : null;
            }
            : undefined;
        return habillerSieges(assignerDeputes(seats, groupes, perchoir, valeur), groupes, actif, indicateursCourants);
    }, [seats, groupes, perchoir, indicateur, indicateursCourants]);

    // Plusieurs groupes à la fois seulement en mode coalition ; sinon, un clic remplace la sélection.
    const multi = mode === "groupes" && coalition;

    const toggle = (code: string) => {
        if (!legislatureNum) return;
        const dejaChoisi = selectedCodes.includes(code);
        const codes = multi
            ? (dejaChoisi ? selectedCodes.filter((c) => c !== code) : [...selectedCodes, code])
            : (dejaChoisi ? [] : [code]);
        setSelection(codes.length > 0 ? { legislature: legislatureNum, codes } : null);
    };

    /** Sortie de la sélection multiple : on garde le dernier groupe choisi. */
    const garderDernierGroupe = () =>
        setSelection((s) => (s && s.codes.length > 1 ? { ...s, codes: s.codes.slice(-1) } : s));

    const changerCoalition = (active: boolean) => {
        setCoalition(active);
        if (!active) garderDernierGroupe();
    };

    const changerMode = (nouveau: ModeHemicycle) => {
        setMode(nouveau);
        if (nouveau === "stats") garderDernierGroupe();
    };

    return (
        <div className="hemicycle-page">
            <header className="hemicycle-header">
                {legislatureNum && <span className="page-pill">{legislatureNum}ème législature</span>}
                <h1>L&apos;hémicycle</h1>
                <p className="subtitle">
                    Chaque carte est un siège, regroupé par groupe parlementaire. Choisis un groupe pour le mettre
                    en relief, active le mode coalition pour en additionner plusieurs, ou colore les sièges selon la
                    présence de chaque député.
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
                    <HemicyclePlan
                        key={current.legislature}
                        seats={seats}
                        selectedCodes={selectedCodes}
                        habillage={habillage}
                        perchoir={perchoir}
                    />
                    <section className="hemicycle-panel">
                        <HemicycleModeChoix
                            mode={mode}
                            coalition={coalition}
                            indicateurId={indicateurId}
                            onModeChangeAction={changerMode}
                            onCoalitionChangeAction={changerCoalition}
                            onIndicateurChangeAction={setIndicateurId}
                        />
                        {indicateur && <HemicycleEchelle indicateur={indicateur} echelle={echelle} chargement={!indicateursCourants} />}
                        <HemicycleLegend groupes={groupes} selectedCodes={selectedCodes} onToggleAction={toggle} />
                        {/* En mode statistiques, la sélection ne fait que mettre un groupe en relief. */}
                        {mode === "groupes" && (
                            <HemicycleDetail
                                groupes={selectedGroupes}
                                total={seats.length}
                                coalition={coalition}
                                onClearAction={() => setSelection(null)}
                            />
                        )}
                    </section>
                </>
            )}
        </div>
    );
}
