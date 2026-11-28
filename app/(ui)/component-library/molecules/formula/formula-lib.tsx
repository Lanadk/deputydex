import React from "react";

export interface FormulaLegendItem {
    /** Symbole tel qu'il apparaît dans la formule (même mini-syntaxe : `J_{d}`). */
    symbol: string;
    description: string;
}

export interface FormulaLibProps {
    /** Nom de l'indicateur, au-dessus de la formule (ex: « Taux de présence »). */
    label?: string;
    /** Membre de gauche (ex: `τ`). */
    result: string;
    /** Numérateur — ou l'expression entière s'il n'y a pas de dénominateur. */
    numerator: string;
    denominator?: string;
    /** Facteur après la fraction (ex: `× 100`). */
    factor?: string;
    /** Chaque symbole de la formule et ce qu'il représente. */
    legend: FormulaLegendItem[];
    /** Précision sous la légende (cas particuliers, exclusions). */
    note?: string;
    /** Encadré propre (bordure + fond, défaut). `false` dans un conteneur qui en a déjà un (panneau d'accordéon). */
    framed?: boolean;
    className?: string;
}

type FormulaToken = { kind: "text"; value: string } | { kind: "sub" | "sup"; children: FormulaToken[] };

/**
 * Découpe une expression de la mini-syntaxe : `_{…}` indice, `^{…}` exposant,
 * le reste tel quel (Unicode : Σ, ∧, ∈, 𝟙, ÷…). Les accolades sont comptées
 * par profondeur, donc un indice peut en contenir un autre (`Σ_{s ∈ S_{m}}`) ;
 * une accolade sans `_` / `^` devant (`{pour, contre}`) reste du texte.
 */
export function tokenizeFormula(expression: string): FormulaToken[] {
    const tokens: FormulaToken[] = [];
    let text = "";
    let i = 0;
    while (i < expression.length) {
        const c = expression[i];
        if ((c === "_" || c === "^") && expression[i + 1] === "{") {
            // Cherche l'accolade fermante de même profondeur.
            let depth = 0;
            let end = i + 1;
            for (; end < expression.length; end++) {
                if (expression[end] === "{") depth++;
                else if (expression[end] === "}" && --depth === 0) break;
            }
            if (end < expression.length) {
                if (text) tokens.push({ kind: "text", value: text });
                text = "";
                tokens.push({ kind: c === "_" ? "sub" : "sup", children: tokenizeFormula(expression.slice(i + 2, end)) });
                i = end + 1;
                continue;
            }
        }
        text += c;
        i++;
    }
    if (text) tokens.push({ kind: "text", value: text });
    return tokens;
}

function renderTokens(tokens: FormulaToken[], keyPrefix = ""): React.ReactNode[] {
    return tokens.map((t, i) => {
        if (t.kind === "text") return t.value;
        const Tag = t.kind;
        // em relatif : un indice d'indice rapetisse encore, sans tomber sous ~50 %.
        return <Tag key={`${keyPrefix}${i}`} className="text-[0.75em]">{renderTokens(t.children, `${keyPrefix}${i}-`)}</Tag>;
    });
}

/** Rendu React d'une expression de la mini-syntaxe (indices / exposants imbriqués). */
export function parseFormula(expression: string): React.ReactNode[] {
    return renderTokens(tokenizeFormula(expression));
}

/** Texte brut d'une expression (lecteurs d'écran, `aria-label`). */
export function formulaToText(expression: string): string {
    const toText = (tokens: FormulaToken[]): string =>
        tokens.map((t) => (t.kind === "text" ? t.value : ` ${t.kind === "sub" ? "indice" : "exposant"} ${toText(t.children)}`)).join("");
    return toText(tokenizeFormula(expression));
}

/**
 * FormulaLib
 * Formule mathématique d'un indicateur (fraction optionnelle, indices,
 * exposants) suivie de la légende de chacun de ses symboles — pour expliquer
 * le calcul EXACT d'une statistique plutôt qu'une phrase approximative.
 */
export const FormulaLib: React.FC<FormulaLibProps> = ({ label, result, numerator, denominator, factor, legend, note, framed = true, className = "" }) => {
    const ariaLabel = `${formulaToText(result)} égale ${formulaToText(numerator)}${denominator ? ` divisé par ${formulaToText(denominator)}` : ""}${factor ? ` ${factor}` : ""}`;

    return (
        <figure
            className={`m-0 flex flex-col gap-3 ${framed ? "rounded-lg border border-main px-4 py-3" : ""} ${className}`}
            style={framed ? { backgroundColor: "var(--surface-2)" } : undefined}
        >
            {label && (
                <figcaption className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--subtitle-accent)" }}>
                    {label}
                </figcaption>
            )}

            <div role="math" aria-label={ariaLabel} className="flex flex-wrap items-center gap-2 overflow-x-auto font-serif text-base" style={{ color: "var(--foreground)" }}>
                <span className="italic">{parseFormula(result)}</span>
                <span>=</span>
                {denominator ? (
                    <span className="inline-flex flex-col items-center text-center">
                        <span className="px-1 pb-0.5">{parseFormula(numerator)}</span>
                        <span className="w-full border-t" style={{ borderColor: "var(--foreground)" }} />
                        <span className="px-1 pt-0.5">{parseFormula(denominator)}</span>
                    </span>
                ) : (
                    <span>{parseFormula(numerator)}</span>
                )}
                {factor && <span>{parseFormula(factor)}</span>}
            </div>

            {legend.length > 0 && (
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                    {legend.map((item) => (
                        <React.Fragment key={item.symbol}>
                            <dt className="font-serif italic" style={{ color: "var(--foreground)" }}>{parseFormula(item.symbol)}</dt>
                            <dd style={{ color: "var(--subtitle-accent)" }}>{item.description}</dd>
                        </React.Fragment>
                    ))}
                </dl>
            )}

            {note && <p className="text-xs leading-relaxed" style={{ color: "var(--subtitle-accent)" }}>{note}</p>}
        </figure>
    );
};
