"use client";

import {useLegislature} from "@/app/(ui)/providers/legislature-provider";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {AnchorLayout} from "@/app/(ui)/component-library/template/sections/anchor-section/anchor-layout";
import {PageContentLib} from "@/app/(ui)/component-library/template/page-content/page-content-lib";
import {GroupeHeader} from "@/app/(ui)/components/groups/fiche/groupe-header";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";
import {groupesGateways} from "@/app/(ui)/gateways/groupes/groupes.gateway";
import {GroupeHeaderSkeleton} from "@/app/(ui)/components/groups/fiche/groupe-header-skeleton";
import {GROUPES_SECTIONS} from "@/app/(ui)/(views)/(db)/groupes/[code]/config";
import {SpinnerLib} from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import {SectionBlockLoader} from "@/app/(ui)/component-library/template/sections/block-section/_loader/section-block-loader";
import {useAsyncData} from "@/app/(ui)/_shared/hook/use-async-data";
import {ErrorStateLib} from "@/app/(ui)/component-library/molecules/error-state/error-state-lib";
import {useNotifications} from "@/app/(ui)/component-library/molecules/notification/notification-lib";

export default function GroupePageClient({code}: { code: string }) {
    const [readyCount, setReadyCount] = useState(0);
    const {legislature, legislatures, setUnavailableLegislatureNumbers} = useLegislature();
    const {notify} = useNotifications();
    // null tant que la législature courante n'est pas chargée : ni en-tête ni
    // sections ne sont demandés d'ici là (sinon une requête part pour rien).
    const legislatureNum = legislature?.number ?? null;

    const params = useMemo(() => ({ code, legislature: legislatureNum }), [code, legislatureNum]);

    const infos = useAsyncData<GroupeInfosDTO>(
        legislatureNum === null ? null : () => groupesGateways.getGroupeInfos(code, legislatureNum),
        `${code}|${legislatureNum}`
    );

    // Un code de groupe (ex: "RE") n'existe pas forcément sous ce nom dans
    // toutes les législatures (ex: devenu "EPR" en 17e) — pas de mapping
    // fiable entre les deux, donc on grise plutôt les législatures où ce
    // code n'a pas existé dans le sélecteur global.
    useEffect(() => {
        // Liste des législatures pas encore chargée : rien à griser, et la
        // requête serait refaite dès son arrivée.
        if (legislatures.length === 0) return;
        let cancelled = false;

        groupesGateways.getGroupeLegislatures(code)
            .then(availableNumbers => {
                if (cancelled) return;
                const available = new Set(availableNumbers);
                const unavailable = new Set(
                    legislatures.map(l => l.number).filter(n => !available.has(n))
                );
                setUnavailableLegislatureNumbers(unavailable);
            })
            .catch(() => {
                // Non bloquant : la page s'affiche, seul le grisage du sélecteur manque.
                if (!cancelled) notify({ message: "Les législatures où ce groupe a existé n'ont pas pu être vérifiées.", variant: "warning" });
            });

        return () => {
            cancelled = true;
            setUnavailableLegislatureNumbers(new Set());
        };
    }, [code, legislatures, setUnavailableLegislatureNumbers, notify]);

    const sectionsToAwait = useMemo(
        () => GROUPES_SECTIONS.filter(s => s.gatewayFn && !s.lazy),
        []
    );
    const allReady = readyCount >= sectionsToAwait.length;
    const noopReady = useCallback(() => {}, []);
    const handleReady = useCallback(() => {
        setReadyCount(c => c + 1);
    }, []);

    return (
        <AnchorLayout
            header={
                infos.error
                    ? <ErrorStateLib message="Impossible de charger les informations du groupe pour le moment." onRetry={infos.retry}/>
                    : infos.data ? <GroupeHeader groupeInfos={infos.data}/> : <GroupeHeaderSkeleton/>
            }
            sections={GROUPES_SECTIONS}
        >
            <div className="mt-4">
                {!allReady && (
                    <div className="flex items-center justify-center h-64">
                        <SpinnerLib />
                    </div>
                )}

                <div className={allReady ? "" : "hidden"}>
                    <PageContentLib>
                        {legislatureNum !== null && GROUPES_SECTIONS.map((section) => (
                            <SectionBlockLoader
                                key={section.id}
                                section={section}
                                params={params}
                                onReady={section.gatewayFn && !section.lazy ? handleReady : noopReady}
                            />
                        ))}
                    </PageContentLib>
                </div>
            </div>
        </AnchorLayout>
    );
}