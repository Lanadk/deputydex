"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLegislature } from "@/app/(ui)/providers/legislature-provider";
import { BaseLayout } from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";
import { PageHeaderLib } from "@/app/(ui)/component-library/template/headers/page-header/page-header-lib";
import { InputLib } from "@/app/(ui)/component-library/molecules/input/input-lib";
import { SelectLib } from "@/app/(ui)/component-library/molecules/select/select-lib";
import { ColumnDef, TableLib } from "@/app/(ui)/component-library/molecules/table/table-lib";
import { TablePaginationLib } from "@/app/(ui)/component-library/molecules/table/components/table-pagination-lib";
import { BadgeLib } from "@/app/(ui)/component-library/atoms/badge/badge-lib";
import { scrutinsGateway } from "@/app/(ui)/gateways/scrutins/scrutins.gateway";
import { ScrutinListItemDTO, ScrutinListPageDTO } from "@/app/domains/scrutins/dto/scrutin-list.dto";
import { formatDateOnlyFr } from "@/app/_shared/utils/date";
import { capitalizeFirst } from "@/app/_shared/utils/string";
import { scrutinResultatColor } from "@/app/(ui)/_shared/adapter/scrutin-resultat.adapter";

/** Valeur des options « tous » : SelectLib réserve "" à son placeholder, et le serveur ignore toute valeur inconnue. */
const ALL = "tous";

const PORTEE_OPTIONS = [
    { value: "importants", label: "Scrutins importants" },
    { value: "tous", label: "Tous les scrutins" },
];
const RESULTAT_OPTIONS = [
    { value: ALL, label: "Tous les résultats" },
    { value: "adopte", label: "Adopté" },
    { value: "rejete", label: "Rejeté" },
];
// Libellés de l'open data, tels qu'affichés dans la liste et sur la fiche scrutin.
const TYPE_OPTIONS = [
    { value: ALL, label: "Tous les types" },
    { value: "SPO", label: "Scrutin public ordinaire" },
    { value: "SPS", label: "Scrutin public solennel" },
    { value: "MOC", label: "Motion de censure" },
];
const OBJET_OPTIONS = [
    { value: ALL, label: "Tous les objets" },
    { value: "ensemble", label: "Ensemble du texte" },
    { value: "article", label: "Article" },
    { value: "amendement", label: "Amendement" },
    { value: "motion", label: "Motion" },
    { value: "autre", label: "Autre" },
];

const SEARCH_DEBOUNCE_MS = 300;

const COLUMNS: ColumnDef<ScrutinListItemDTO>[] = [
    {
        id: "date",
        header: "Date",
        align: "center",
        width: 110,
        cell: (r) => formatDateOnlyFr(r.date) ?? "—",
    },
    {
        id: "titre",
        header: "Scrutin",
        align: "left",
        cell: (r) => (
            <div className="flex flex-col gap-1">
                <Link href={`/scrutins/${r.uid}`} className="hover:underline">
                    {r.titre ? capitalizeFirst(r.titre) : `Scrutin n° ${r.numero ?? r.uid}`}
                </Link>
                <span className="text-xs text-gray-500">
                    n° {r.numero ?? "—"} · {r.objet.libelle} · {r.type.libelle ? capitalizeFirst(r.type.libelle) : "—"}
                </span>
            </div>
        ),
    },
    {
        id: "resultat",
        header: "Résultat",
        align: "center",
        cell: (r) => r.resultat.libelle ? (
            <BadgeLib
                text={r.resultat.libelle}
                style={{ color: "white", backgroundColor: scrutinResultatColor(r.resultat.isAdopte) }}
            />
        ) : "—",
    },
    { id: "pour", header: "Pour", align: "center", cell: (r) => r.pour ?? "—" },
    { id: "contre", header: "Contre", align: "center", cell: (r) => r.contre ?? "—" },
    { id: "abstentions", header: "Abst.", align: "center", cell: (r) => r.abstentions ?? "—" },
];

type Filters = { portee: string; resultat: string; type: string; objet: string };
const DEFAULT_FILTERS: Filters = { portee: "importants", resultat: ALL, type: ALL, objet: ALL };

export default function ScrutinsPageClient() {
    const { legislature } = useLegislature();
    const legislatureNumber = legislature?.number;

    const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    // Dernière réponse reçue, avec la requête qui l'a produite : tant qu'elle ne
    // correspond pas à la requête courante, la page est en chargement.
    const [response, setResponse] = useState<{ key: string; data: ScrutinListPageDTO | null; failed: boolean }>(
        { key: "", data: null, failed: false }
    );

    // Changement de législature : retour en page 1 (ajusté au rendu, pas dans un effet).
    const [previousLegislature, setPreviousLegislature] = useState(legislatureNumber);
    if (legislatureNumber !== previousLegislature) {
        setPreviousLegislature(legislatureNumber);
        setPage(1);
    }

    // Recherche : on attend une pause dans la frappe avant d'interroger le serveur.
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [search]);

    const requestKey = JSON.stringify([legislatureNumber, filters, debouncedSearch, page]);

    useEffect(() => {
        if (!legislatureNumber) return;
        const controller = new AbortController();
        scrutinsGateway
            .getScrutinsList(legislatureNumber, { ...filters, q: debouncedSearch, page: String(page) }, controller.signal)
            .then((data) => setResponse({ key: requestKey, data, failed: false }))
            .catch((e) => {
                if (controller.signal.aborted) return;
                console.error(e);
                setResponse((prev) => ({ key: requestKey, data: prev.data, failed: true }));
            });
        // Une réponse plus ancienne ne doit pas écraser la plus récente.
        return () => controller.abort();
    }, [legislatureNumber, filters, debouncedSearch, page, requestKey]);

    const loading = response.key !== requestKey;
    const failed = !loading && response.failed;
    const result = response.data;

    const setFilter = (key: keyof Filters) => (value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const pageCount = result?.pageCount ?? 1;

    return (
        <BaseLayout>
            <div className="mb-8 border-b border-main pb-6">
                <PageHeaderLib
                    title="Scrutins"
                    subtitle="Les votes de l'Assemblée nationale : résultat de chaque scrutin et position de chaque groupe et de chaque député. Par défaut, seuls les scrutins importants sont affichés : scrutins solennels, motions de censure et votes sur l'ensemble d'un texte."
                />
            </div>

            <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 items-end">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <InputLib label="Recherche" placeholder="Rechercher dans le titre" value={search} onChange={setSearch} />
                    </div>
                    <SelectLib label="Portée" options={PORTEE_OPTIONS} value={filters.portee} onChange={setFilter("portee")} />
                    <SelectLib label="Résultat" options={RESULTAT_OPTIONS} value={filters.resultat} onChange={setFilter("resultat")} />
                    <SelectLib label="Type" options={TYPE_OPTIONS} value={filters.type} onChange={setFilter("type")} />
                    <SelectLib label="Objet" options={OBJET_OPTIONS} value={filters.objet} onChange={setFilter("objet")} />
                </div>

                <span className="text-sm text-gray-600">
                    {failed ? "Impossible de charger les scrutins." : result ? `${result.total} scrutin(s)` : "Chargement…"}
                </span>

                <TableLib
                    rows={result?.items ?? []}
                    columns={COLUMNS}
                    getRowKeyAction={(r) => r.uid}
                    loading={loading}
                    emptyLabel="Aucun scrutin ne correspond à ces critères."
                    striped={true}
                />

                <TablePaginationLib
                    page={page}
                    pageCount={pageCount}
                    total={result?.total}
                    loading={loading}
                    onPrevAction={() => setPage((p) => Math.max(1, p - 1))}
                    onNextAction={() => setPage((p) => Math.min(pageCount, p + 1))}
                />
            </div>
        </BaseLayout>
    );
}
