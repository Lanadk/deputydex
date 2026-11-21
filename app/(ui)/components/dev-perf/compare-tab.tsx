"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { InputLib } from "@/app/(ui)/component-library/molecules/input/input-lib";
import { DevPerfSnapshot } from "@/app/_shared/dev-perf/dev-perf.types";
import {
    buildBaseline,
    compareToBaseline,
    ComparisonRow,
    parseBaselineFile,
    PerfBaseline,
} from "@/app/_shared/dev-perf/dev-perf.baseline";
import { card, Delta, Ms, SectionTitle, td, tdNum, th, thNum } from "@/app/(ui)/components/dev-perf/dev-perf-ui";

/** La référence reste dans le navigateur d'une session à l'autre (le serveur oublie tout au redémarrage). */
const STORAGE_KEY = "deputydex-dev-perf-baseline";

function ComparisonTable({ title, keyLabel, rows }: { title: string; keyLabel: string; rows: ComparisonRow[] }) {
    return (
        <div className={`${card} overflow-x-auto`}>
            <h3 className="mb-2 font-semibold">{title}</h3>
            {rows.length === 0 ? (
                <p className="text-sm text-subtitle-accent">Rien à comparer.</p>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className={th}>{keyLabel}</th>
                            <th className={thNum}>p50 : référence → actuel</th>
                            <th className={thNum}>Écart p50</th>
                            <th className={thNum}>p95 : référence → actuel</th>
                            <th className={thNum}>Écart p95</th>
                            <th className={thNum}>Mesures (réf. / act.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.key}>
                                <td className={`${td} font-mono`}>{r.key}</td>
                                <td className={tdNum}>
                                    {r.before ? <Ms ms={r.before.p50Ms} /> : "—"} → {r.after ? <Ms ms={r.after.p50Ms} /> : "—"}
                                </td>
                                <td className={tdNum}><Delta delta={r.p50} /></td>
                                <td className={tdNum}>
                                    {r.before ? <Ms ms={r.before.p95Ms} /> : "—"} → {r.after ? <Ms ms={r.after.p95Ms} /> : "—"}
                                </td>
                                <td className={tdNum}><Delta delta={r.p95} /></td>
                                <td className={`${tdNum} ${r.fewSamples ? "text-subtitle-accent" : ""}`}>
                                    {r.before?.count ?? 0} / {r.after?.count ?? 0}{r.fewSamples && " (trop peu)"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function download(baseline: PerfBaseline) {
    const blob = new Blob([JSON.stringify(baseline, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `perf-reference-${baseline.createdAt.slice(0, 19).replace(/[:T]/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Onglet « Comparaison » : fige une référence « avant » (ou l'importe : export
 * de cette page, ou fichier écrit par `npm run perf:bench`), puis compare les
 * mesures actuelles par requête et par page.
 */
export function CompareTab({ snapshot }: { snapshot: DevPerfSnapshot }) {
    const [baseline, setBaseline] = useState<PerfBaseline | null>(null);
    const [label, setLabel] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    // Lecture après le montage : localStorage n'existe pas au rendu serveur.
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (stored) setBaseline(parseBaselineFile(JSON.parse(stored), "Référence", new Date().toISOString()));
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const keep = (b: PerfBaseline | null, msg: string) => {
        setBaseline(b);
        if (b) localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
        else localStorage.removeItem(STORAGE_KEY);
        setMessage(msg);
    };

    const saveCurrent = () => {
        const now = new Date();
        const name = label.trim() || `Référence du ${now.toLocaleString("fr-FR")}`;
        keep(buildBaseline(snapshot, name, now.toISOString()), `« ${name} » enregistrée comme référence.`);
    };

    const importFile = async (file: File) => {
        try {
            const parsed = parseBaselineFile(JSON.parse(await file.text()), file.name, new Date().toISOString());
            if (parsed) keep(parsed, `« ${parsed.label} » importée comme référence.`);
            else setMessage("Fichier non reconnu : ni une référence exportée, ni un résultat de perf:bench.");
        } catch {
            setMessage("Fichier illisible (JSON invalide).");
        }
    };

    const comparison = useMemo(
        () => baseline && compareToBaseline(baseline, buildBaseline(snapshot, "Actuel", new Date().toISOString())),
        [baseline, snapshot]
    );

    return (
        <section className="flex flex-col gap-4">
            <SectionTitle
                title="Comparaison avec une référence"
                hint="Mesure une première fois (« avant »), enregistre-la comme référence, applique ton optimisation, vide les mesures et mesure de nouveau : les écarts p50 / p95 apparaissent par requête et par page. Vert : plus rapide ; rouge : plus lent ; en deçà de ±10 %, l'écart est considéré comme du bruit. Sous 1 ms de référence (réponse du cache), l'écart est donné en ms (bruit : ±5 ms). Avec moins de 5 mesures d'un côté, l'écart est grisé (« ? ») et classé après les écarts fiables : sur si peu de mesures, le p95 n'est que la plus lente."
            />

            <div className={`${card} flex flex-col gap-3`}>
                <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-72">
                        <InputLib value={label} onChange={setLabel} placeholder="Nom de la référence (facultatif)" />
                    </div>
                    <ButtonLib text="Enregistrer les mesures actuelles comme référence" size="small" onClick={saveCurrent} />
                    <label className="btn-lib btn-lib--tertiary btn-lib--small cursor-pointer">
                        Importer un fichier…
                        <input
                            type="file"
                            accept="application/json,.json"
                            className="sr-only"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = ""; }}
                        />
                    </label>
                    {baseline && <ButtonLib text="Exporter la référence" variant="tertiary" size="small" onClick={() => download(baseline)} />}
                    {baseline && <ButtonLib text="Supprimer la référence" variant="tertiary" size="small" onClick={() => keep(null, "Référence supprimée.")} />}
                </div>
                <p className="text-sm text-subtitle-accent">
                    {baseline
                        ? <>Référence : <strong>{baseline.label}</strong> ({new Date(baseline.createdAt).toLocaleString("fr-FR")}).</>
                        : "Aucune référence pour l'instant."}
                    {message && <> {message}</>}
                </p>
                <p className="text-sm text-subtitle-accent">
                    Mesure reproductible : <code className="font-mono">npm run perf:bench</code> visite les pages clés plusieurs fois dans un
                    navigateur sans interface et écrit un fichier à importer ici (voir <code className="font-mono">app/6.DEV-PERF.md</code>).
                </p>
            </div>

            {comparison && (
                <>
                    <ComparisonTable title="Requêtes API : serveur (tous appels, cache compris)" keyLabel="Requête" rows={comparison.server} />
                    <ComparisonTable title="Requêtes API : navigateur" keyLabel="Requête" rows={comparison.network} />
                    <ComparisonTable title="Pages : durée jusqu'à la dernière donnée" keyLabel="Page" rows={comparison.pages} />
                </>
            )}
        </section>
    );
}
