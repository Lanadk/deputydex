'use client';

import { FilterBar } from "@/app/component-library/molecules/filter-bar/filter-bar";
import { FilterBarDebug } from "@/app/component-library/molecules/filter-bar/filter-bar-debug";
import { useEffect, useState } from "react";
import { ACTEURS_FILTER_FIELDS, ACTEURS_SORT_OPTIONS } from "@/app/lib/filters/acteurs.filters";
import { FilterBarQuery } from "@/app/component-library/molecules/filter-bar/filter-bar.types";
import { ActeurDTO } from "@/app/lib/dto/acteur.dto";
import { searchActeurs } from "@/app/services/acteurs/acteurs.client";

const CODE_BASIC_SORT = `import { FilterBar } from "@/app/component-library/molecules/filter-bar/filter-bar";

<FilterBar
  sortOptions={ACTEURS_SORT_OPTIONS}
  onQueryChange={(query) => console.log(query)}
/>`;

const CODE_AND_SORT = `import { FilterBar } from "@/app/component-library/molecules/filter-bar/filter-bar";

<FilterBar
  sortOptions={ACTEURS_SORT_OPTIONS}
  filterFields={ACTEURS_FILTER_FIELDS}
  onQueryChange={(query) => console.log(query)}
/>`;

const CODE_SERVER = `import { useEffect, useState } from "react";
import { FilterBar } from "@/app/component-library/molecules/filter-bar/filter-bar";
import { searchActeursClient } from "@/app/services/acteurs/acteurs.client";

function Example() {
  const [query, setQuery] = useState({ orderBy: [], where: {} });
  const [acteurs, setActeurs] = useState([]);

  useEffect(() => {
    searchActeursClient(query).then(setActeurs);
  }, [query]);

  return (
    <>
      <FilterBar
        sortOptions={ACTEURS_SORT_OPTIONS}
        filterFields={ACTEURS_FILTER_FIELDS}
        onQueryChange={setQuery}
      />

      <table>
        {acteurs.map((acteur) => (
          <tr key={acteur.id}>
            <td>{acteur.prenom}</td>
            <td>{acteur.nom}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
`;

function BasicSort() {
    const [query, setQuery] = useState<FilterBarQuery>({ orderBy: [], where: {} });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <FilterBar sortOptions={ACTEURS_SORT_OPTIONS} onQueryChange={setQuery} />
            <FilterBarDebug query={query} />
        </div>
    );
}

function AndSort() {
    const [query, setQuery] = useState<FilterBarQuery>({ orderBy: [], where: {} });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <FilterBar
                sortOptions={ACTEURS_SORT_OPTIONS}
                filterFields={ACTEURS_FILTER_FIELDS}
                onQueryChange={setQuery}
            />
            <FilterBarDebug query={query} />
        </div>
    );
}

export function ActeursWithPaginationExample() {
    const [query, setQuery] = useState<FilterBarQuery>({ orderBy: [], where: {} });
    const [page, setPage] = useState(1);
    const pageSize = 50;

    const [items, setItems] = useState<ActeurDTO[]>([]);
    const [pageCount, setPageCount] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // reset page si query change (important)
    useEffect(() => {
        setPage(1);
    }, [query]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            try {
                const res = await searchActeurs(query, page, pageSize);
                if (!cancelled) {
                    setItems(res.items);
                    setPageCount(res.pageCount);
                    setTotal(res.total);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [query, page]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FilterBar
                sortOptions={ACTEURS_SORT_OPTIONS}
                filterFields={ACTEURS_FILTER_FIELDS}
                applyMode="manual"
                onQueryChange={setQuery}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>
                    Précédent
                </button>

                <div style={{ color: "var(--subtitle-accent)" }}>
                    Page {page} / {pageCount} — {total} résultat(s) {loading ? "· chargement…" : ""}
                </div>

                <button
                    type="button"
                    disabled={page >= pageCount || loading}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Suivant
                </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th style={{ textAlign: "left" }}>Prénom</th>
                    <th style={{ textAlign: "left" }}>Nom</th>
                    <th style={{ textAlign: "left" }}>Profession</th>
                </tr>
                </thead>
                <tbody>
                {items.map((a) => (
                    <tr key={a.id}>
                        <td>{a.prenom}</td>
                        <td>{a.nom}</td>
                        <td>{a.profession_categorie}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export const getFilterBarSections = () => [
    {
        title: "Tri simple — une option active à la fois",
        code: CODE_BASIC_SORT,
        component: <BasicSort />,
    },
    {
        title: "Tri + And sort",
        code: CODE_AND_SORT,
        component: <AndSort />,
    },
    {
        title: "Filtrage serveur via API (Prisma côté serveur)",
        code: CODE_SERVER,
        component: <ActeursWithPaginationExample />,
    },
];