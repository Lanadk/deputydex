"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TabLayout } from "@/app/(ui)/component-library/template/sections/tab-section/tab-layout";
import { TabPanelLib } from "@/app/(ui)/component-library/template/sections/tab-section/tab-panel-lib";
import { useLegislature } from "@/app/(ui)/providers/legislature-provider";
import { DeputeHeader } from "@/app/(ui)/components/deputy/fiche/depute-header";
import { DeputeHeaderSkeleton } from "@/app/(ui)/components/deputy/fiche/depute-header-skeleton";
import { SectionBlockLoader } from "@/app/(ui)/component-library/template/sections/block-section/_loader/section-block-loader";
import { SpinnerLib } from "@/app/(ui)/component-library/molecules/spinner/spinner-lib";
import { DeputeIdentityDTO } from "@/app/domains/deputes/dto/depute-identity.dto";
import { deputesGateway } from "@/app/(ui)/gateways/deputes/deputes.gateway";
import { DEPUTE_ONGLETS, DEPUTE_SECTIONS } from "@/app/(ui)/(views)/(db)/deputes/[uid]/config";
import { useAsyncData } from "@/app/(ui)/_shared/hook/use-async-data";
import { ErrorStateLib } from "@/app/(ui)/component-library/molecules/error-state/error-state-lib";
import { useNotifications } from "@/app/(ui)/component-library/molecules/notification/notification-lib";

export default function DeputePageClient({ uid }: { uid: string }) {
    const [readyCount, setReadyCount] = useState(0);
    const { legislature, legislatures, setUnavailableLegislatureNumbers } = useLegislature();
    const { notify } = useNotifications();
    // null tant que la législature courante n'est pas chargée : ni en-tête ni
    // sections ne sont demandés d'ici là (sinon une requête part pour rien).
    const legislatureNum = legislature?.number ?? null;

    const params = useMemo(
        () => ({ uid, legislature: legislatureNum }),
        [uid, legislatureNum]
    );

    const identity = useAsyncData<DeputeIdentityDTO>(
        legislatureNum === null ? null : () => deputesGateway.getDeputeIdentity(uid, legislatureNum),
        `${uid}|${legislatureNum}`
    );

    // Un député n'a pas forcément siégé sous toutes les législatures (élu
    // en 17e seulement, par exemple) — appeler l'identité sur une
    // législature où il n'existe pas fait échouer la requête serveur. On
    // grise donc ces législatures dans le sélecteur global, comme pour les
    // groupes (cf. groupe-page-client.tsx).
    useEffect(() => {
        // Liste des législatures pas encore chargée : rien à griser, et la
        // requête serait refaite dès son arrivée.
        if (legislatures.length === 0) return;
        let cancelled = false;

        deputesGateway.getDeputeLegislatures(uid)
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
                if (!cancelled) notify({ message: "Les législatures où ce député a siégé n'ont pas pu être vérifiées.", variant: "warning" });
            });

        return () => {
            cancelled = true;
            setUnavailableLegislatureNumbers(new Set());
        };
    }, [uid, legislatures, setUnavailableLegislatureNumbers, notify]);

    const sectionsToAwait = useMemo(
        () => DEPUTE_SECTIONS.filter((s) => s.gatewayFn && !s.lazy),
        []
    );
    const allReady = readyCount >= sectionsToAwait.length;
    const noopReady = useCallback(() => {}, []);
    const handleReady = useCallback(() => setReadyCount((c) => c + 1), []);

    return (
        // Une thématique par onglet : la fiche complète, en défilement, était trop longue.
        <TabLayout
            header={
                identity.error
                    ? <ErrorStateLib message="Impossible de charger les informations du député pour le moment." onRetry={identity.retry} />
                    : identity.data ? <DeputeHeader identity={identity.data} /> : <DeputeHeaderSkeleton />
            }
            sections={DEPUTE_ONGLETS}
            tabsLabel="Fiche du député"
        >
            <div className="mt-4">
                {!allReady && (
                    <div className="flex items-center justify-center h-64">
                        <SpinnerLib />
                    </div>
                )}
                <div className={allReady ? "" : "hidden"}>
                    {legislatureNum !== null && DEPUTE_ONGLETS.map((onglet) => (
                        // Un onglet par thème ; ses sections (sous-thèmes) dans la nav latérale du panneau,
                        // espacées par le panneau lui-même.
                        <TabPanelLib key={onglet.id} id={onglet.id} sections={onglet.sections} navLabel={onglet.label}>
                            {onglet.sections.map((section) => (
                                <SectionBlockLoader
                                    key={section.id}
                                    section={section}
                                    params={params}
                                    onReady={
                                        section.gatewayFn && !section.lazy
                                            ? handleReady
                                            : noopReady
                                    }
                                />
                            ))}
                        </TabPanelLib>
                    ))}
                </div>
            </div>
        </TabLayout>
    );
}
