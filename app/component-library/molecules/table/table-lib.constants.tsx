"use client";

import React, {useMemo, useState} from "react";
import type {ColumnDef} from "@/app/component-library/molecules/table/table-lib";
import {TableLib} from "@/app/component-library/molecules/table/table-lib";
import {TablePaginationLib} from "@/app/component-library/molecules/table/components/table-pagination-lib";
import {FilterBar} from "@/app/component-library/molecules/filter-bar/filter-bar";
import {ACTEURS_FILTER_FIELDS, ACTEURS_SORT_OPTIONS} from "@/app/lib/filters/acteurs.filters";
import {FilterBarQuery} from "@/app/component-library/molecules/filter-bar/filter-bar.types";
import {applyFilterBarQueryClient} from "@/app/component-library/molecules/filter-bar/filterbar-apply-client";
import {TableActions} from "@/app/component-library/molecules/table/components/table-actions";
import {exportRows} from "@/app/lib/utils/export/download-export";
import {CsvColumn} from "@/app/lib/utils/export/csv";

type MockActeur = {
    id: string;
    prenom: string;
    nom: string;
    profession_categorie: string;
    date_naissance: string;
};

function makeMockActeurs(count: number): MockActeur[] {
    const prenoms = ["Alice", "Mehdi", "Claire", "Sofiane", "Lina", "Thomas", "Nina", "Hugo"];
    const noms = ["Durand", "Martin", "Bernard", "Petit", "Robert", "Richard", "Moreau", "Fournier"];
    const profs = ["Avocat", "Médecin", "Ingénieur", "Professeur", "Journaliste", "Comptable"];

    const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

    return Array.from({length: count}).map((_, i) => {
        const prenom = prenoms[i % prenoms.length];
        const nom = noms[(i * 3) % noms.length];
        const profession_categorie = profs[(i * 7) % profs.length];

        const year = 1970 + (i % 30);
        const month = 1 + (i % 12);
        const day = 1 + (i % 28);

        return {
            id: String(1000 + i),
            prenom,
            nom,
            profession_categorie,
            date_naissance: `${year}-${pad2(month)}-${pad2(day)}`,
        };
    });
}

const columns: ColumnDef<MockActeur>[] = [
    {
        id: "prenom",
        header: "Prénom",
        cell: (a) => a.prenom,
    },
    {
        id: "nom",
        header: "Nom",
        cell: (a) => a.nom,
    },
    {
        id: "profession",
        header: "Profession",
        cell: (a) => a.profession_categorie,
    },
    {
        id: "naissance",
        header: "Naissance",
        cell: (a) => a.date_naissance,
    },
];

const CODE_NO_PAGINATION = `import { TableLib } from "@/app/component-library/molecules/table/table-lib";

const columns = [
  { id: "prenom", header: "Prénom", cell: (a) => a.prenom },
  { id: "nom", header: "Nom", cell: (a) => a.nom },
  { id: "profession", header: "Profession", cell: (a) => a.profession_categorie },
  { id: "naissance", header: "Naissance", cell: (a) => a.date_naissance },
];

<TableLib
  rows={acteurs}
  columns={columns}
  getRowKeyAction={(a) => a.id}
/>
`;

const CODE_LOCAL_PAGINATION = `import { useMemo, useState } from "react";
import { TableLib } from "@/app/component-library/molecules/table/table-lib";
import { TablePaginationLib } from "@/app/component-library/molecules/table/table-pagination-lib";

function Example({ acteurs }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const pageCount = Math.max(1, Math.ceil(acteurs.length / pageSize));

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return acteurs.slice(start, start + pageSize);
  }, [acteurs, page, pageSize]);

  return (
    <>
      <TableLib rows={pageRows} columns={columns} getRowKey={(a) => a.id} />

      <TablePaginationLib
        page={page}
        pageCount={pageCount}
        total={acteurs.length}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(pageCount, p + 1))}
      />
    </>
  );
}
`;

function TableNoPaginationExample() {
    const acteurs = useMemo(() => makeMockActeurs(12), []);

    return (
        <TableLib
            rows={acteurs}
            columns={columns}
            getRowKeyAction={(a) => a.id}
            emptyLabel="Aucun acteur"
        />
    );
}

function TableWithLocalPaginationExample() {
    const acteurs = useMemo(() => makeMockActeurs(67), []);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const pageCount = Math.max(1, Math.ceil(acteurs.length / pageSize));

    const pageRows = useMemo(() => {
        const start = (page - 1) * pageSize;
        return acteurs.slice(start, start + pageSize);
    }, [acteurs, page, pageSize]);

    return (
        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
            <TableLib
                rows={pageRows}
                columns={columns}
                getRowKeyAction={(a) => a.id}
                emptyLabel="Aucun acteur"
            />

            <TablePaginationLib
                page={page}
                pageCount={pageCount}
                total={acteurs.length}
                onPrevAction={() => setPage((p) => Math.max(1, p - 1))}
                onNextAction={() => setPage((p) => Math.min(pageCount, p + 1))}
            />
        </div>
    );
}

function TableWithFilterNoPaginationExample() {
    const all = useMemo(() => makeMockActeurs(60), []);
    const [query, setQuery] = useState<FilterBarQuery>({orderBy: [], where: {}});

    const filtered = useMemo(() => applyFilterBarQueryClient(all, query), [all, query]);

    return (
        <div style={{display: "flex", flexDirection: "column", gap: 16}}>
            <FilterBar
                sortOptions={ACTEURS_SORT_OPTIONS}
                filterFields={ACTEURS_FILTER_FIELDS}
                applyMode="manual"
                onQueryChange={setQuery}
            />

            <TableLib
                rows={filtered}
                columns={columns}
                getRowKeyAction={(a) => a.id}
                emptyLabel="Aucun acteur"
            />
        </div>
    );
}

function TableWithFilterAndLocalPaginationExample() {
    const all = useMemo(() => makeMockActeurs(200), []);
    const [query, setQuery] = useState<FilterBarQuery>({orderBy: [], where: {}});
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const filtered = useMemo(() => applyFilterBarQueryClient(all, query), [all, query]);

    const handleQueryChange = (q: FilterBarQuery) => {
        setPage(1);
        setQuery(q);
    };

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

    const pageRows = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    return (
        <div style={{display: "flex", flexDirection: "column", gap: 16}}>
            <FilterBar
                sortOptions={ACTEURS_SORT_OPTIONS}
                filterFields={ACTEURS_FILTER_FIELDS}
                applyMode="auto"
                onQueryChange={handleQueryChange}
            />

            <TableLib rows={pageRows} columns={columns} getRowKeyAction={(a) => a.id} emptyLabel="Aucun acteur"/>

            <TablePaginationLib
                page={page}
                pageCount={pageCount}
                total={filtered.length}
                onPrevAction={() => setPage((p) => Math.max(1, p - 1))}
                onNextAction={() => setPage((p) => Math.min(pageCount, p + 1))}
            />
        </div>
    );
}


function TableWithFilterExportAndLocalPaginationExample() {
    const all = useMemo(() => makeMockActeurs(200), []);

    const [query, setQuery] = useState<FilterBarQuery>({
        orderBy: [],
        where: {},
    });

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const filtered = useMemo(
        () => applyFilterBarQueryClient(all, query),
        [all, query]
    );

    const handleQueryChange = (q: FilterBarQuery) => {
        setPage(1);
        setQuery(q);
    };

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

    const pageRows = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    const ACTEURS_CSV_COLUMNS: CsvColumn<MockActeur>[] = [
        {header: "id", value: (a) => a.id},
        {header: "prenom", value: (a) => a.prenom},
        {header: "nom", value: (a) => a.nom},
        {header: "profession_categorie", value: (a) => a.profession_categorie},
        {header: "date_naissance", value: (a) => a.date_naissance},
    ];

    return (
        <div style={{display: "flex", flexDirection: "column", gap: 16}}>
            <FilterBar
                sortOptions={ACTEURS_SORT_OPTIONS}
                filterFields={ACTEURS_FILTER_FIELDS}
                applyMode="auto"
                onQueryChange={handleQueryChange}
            />

            <TableActions
                title="Acteurs"
                hint={`Export : ${filtered.length} résultat(s) filtré(s)`}
                onExportAction={(format) => exportRows(filtered, format, {
                        filenameBase: "acteurs_export",
                        csvColumns: ACTEURS_CSV_COLUMNS,
                        delimiter: ";",
                        includeBom: true,
                        addDateSuffix: true,
                    }
                )}
            />

            <TableLib
                rows={pageRows}
                columns={columns}
                getRowKeyAction={(a) => a.id}
                emptyLabel="Aucun acteur"
            />

            <TablePaginationLib
                page={page}
                pageCount={pageCount}
                total={filtered.length}
                onPrevAction={() => setPage((p) => Math.max(1, p - 1))}
                onNextAction={() => setPage((p) => Math.min(pageCount, p + 1))}
            />
        </div>
    );
}


export const getTableSections = () => [
    {
        title: "Table — sans pagination (liste courte)",
        code: CODE_NO_PAGINATION,
        component: <TableNoPaginationExample/>,
    },
    {
        title: "Table — pagination locale (client-side)",
        code: CODE_LOCAL_PAGINATION,
        component: <TableWithLocalPaginationExample/>,
    },
    {
        title: "Table + FilterBar (client-side) — sans pagination",
        code: "// Voir implémentation dans table.constants.tsx",
        component: <TableWithFilterNoPaginationExample/>,
    },
    {
        title: "Table + FilterBar (client-side) — pagination locale",
        code: "// Voir implémentation dans table.constants.tsx",
        component: <TableWithFilterAndLocalPaginationExample/>,
    },
    {
        title: "Table + FilterBar + Export (CSV / JSON)",
        code: "// Export basé sur les résultats filtrés (pas la pagination)",
        component: <TableWithFilterExportAndLocalPaginationExample/>,
    },
];
