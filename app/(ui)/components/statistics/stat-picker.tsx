"use client";

import React, { useEffect, useRef, useState } from "react";
import { ButtonLib } from "@/app/(ui)/component-library/atoms/button/button-lib";
import { CheckboxLib } from "@/app/(ui)/component-library/molecules/checkbox/checkbox-lib";
import { STATS_CATALOG } from "@/app/(ui)/_shared/statistics/catalog/stats-catalog";
import {
    findStatDefinition,
    getComparableStats,
    groupStatsByCategory,
} from "@/app/(ui)/_shared/statistics/catalog/stats-catalog.helpers";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";
import { StatDomain, StatFetchParams, StatScope } from "@/app/_shared/statistics/stat-scope.types";
import { ENTITY_RESOLVERS } from "@/app/(ui)/components/statistics/entity-resolvers/entity-resolvers.registry";
import { isContextReady } from "@/app/(ui)/_shared/statistics/context/is-context-ready";
import { StatSearch } from "@/app/(ui)/components/statistics/stat-search";

interface StatPickerProps {
    /** ids déjà sélectionnés (ComparatorState.selectedStatIds) — pilote la contrainte domaine/scope */
    selectedStatIds: string[];
    onToggleStat: (definitionId: string) => void;
    /** contexte du contexte de comparaison que CE picker édite (contexts[contextIndex]) */
    context: StatFetchParams;
    onContextChange: (params: StatFetchParams) => void;
    /** vide selectedStatIds — utilisé par le changement de domaine/scope hors comparaison */
    onClearSelection: () => void;
    /**
     * Bouton "Réinitialiser" : vide CE contexte (RESET_CONTEXT côté reducer).
     * Vide aussi selectedStatIds — donc débloque le choix de domaine — mais
     * seulement si TOUS les contextes sont vides après coup ; sinon l'autre
     * colonne perdrait son graphe (voir comparator.reducer.ts).
     */
    onReset: () => void;
    /** true seulement en mode split — la contrainte domaine/scope ne se justifie qu'en comparaison réelle */
    isComparing: boolean;
    /**
     * Contexte de l'AUTRE colonne en comparaison — `null` hors comparaison.
     * Transmis tel quel à l'EntityResolver du domaine pour qu'il grise la
     * valeur déjà prise en face (même législature, même entité) : voir
     * EntityResolverProps.otherContext.
     */
    otherContext?: StatFetchParams | null;
}

/**
 * Menu domaines (tuiles) → résolution entité précise vs population
 * (EntityResolver du domaine, s'il existe) → dropdown par catégorie (cases
 * à cocher). Deux garde-fous :
 *
 * 1. Domaine/scope incompatibles désactivés — mais SEULEMENT en comparaison
 *    (`isComparing`) : hors comparaison, rien n'empêche de changer de
 *    domaine/scope librement, ça vide juste la sélection en cours (elle
 *    n'aurait plus de sens dans le nouveau contexte).
 * 2. Les catégories ne s'affichent qu'une fois le contexte "prêt" (entité
 *    choisie en scope entity, législature choisie en scope aggregate dès
 *    qu'un EntityResolver existe pour le domaine) — cocher une stat avant ça
 *    déclencherait un fetch avec des paramètres incomplets côté serveur.
 *
 * Composant propre à la feature Statistics (types StatDefinition non
 * génériques) — volontairement hors component-library, voir
 * app/(ui)/components/groups/group-filters.tsx pour le même principe.
 */
export const StatPicker: React.FC<StatPickerProps> = ({
                                                            selectedStatIds,
                                                            onToggleStat,
                                                            context,
                                                            onContextChange,
                                                            onClearSelection,
                                                            onReset,
                                                            isComparing,
                                                            otherContext,
                                                        }) => {
    const [openDomain, setOpenDomain] = useState<StatDomain | null>(null);
    const [localScope, setLocalScope] = useState<StatScope>("aggregate");
    // true juste après un "Réinitialiser" de CE picker, tant que l'utilisateur
    // n'a pas recliqué une tuile domaine — sert à faire gagner explicitement
    // le "aucun domaine ouvert" sur la contrainte partagée (voir activeDomain
    // ci-dessous), sans quoi le reset n'aurait aucun effet visible tant que
    // l'autre contexte garde une stat sélectionnée.
    const [isClosed, setIsClosed] = useState(false);
    // Stat visée par un choix fait via StatSearch, tant que le contexte
    // (entité/législature) n'est pas encore prêt pour l'auto-cocher — voir
    // l'effet plus bas. Porte domain/scope avec elle (pas juste l'id) pour
    // que l'auto-cochage ne se déclenche QUE si le picker est toujours sur
    // le bon domain/scope au moment où le contexte devient prêt (sinon un
    // changement manuel entre-temps auto-cocherait la mauvaise stat).
    const [pendingSelect, setPendingSelect] = useState<{ id: string; title: string; domain: StatDomain; scope: StatScope } | null>(null);
    // Id déjà "consommé" par l'effet d'auto-cochage ci-dessous — empêche de
    // re-cocher en boucle une stat que l'utilisateur vient de décocher à la
    // main (BUG corrigé : sans ce garde-fou, pendingSelect ne redevenait
    // jamais "consommé", donc décocher une stat sélectionnée via StatSearch
    // la faisait recocher immédiatement au rendu suivant — elle restait
    // bloquée cochée pour de bon). Un ref, pas un state : la remettre à jour
    // dans l'effet ne doit pas déclencher de re-render (règle
    // react-hooks/set-state-in-effect — un ref n'est pas concerné).
    const firedPendingIdRef = useRef<string | null>(null);

    const referenceId = selectedStatIds[0];
    const reference = referenceId ? findStatDefinition(STATS_CATALOG, referenceId) : null;
    const rawConstraint = reference ? { domain: reference.domain, scope: reference.scope } : null;

    // La contrainte de compatibilité ne s'applique qu'en comparaison
    const selectionConstraint = isComparing ? rawConstraint : null;
    const lockedScope = isComparing ? (reference?.scope ?? null) : null;

    // rawConstraint (dérivé de selectedStatIds, PARTAGÉ entre les deux
    // pickers en comparaison) doit toujours gagner sur openDomain (état
    // local à CE picker) dès qu'il existe : selectedStatIds peut être établi
    // par l'AUTRE contexte (ex: les deux contextes sont vides, l'utilisateur
    // coche une catégorie côté B) — openDomain de CE picker resterait alors
    // sur un domaine périmé (celui qu'il affichait avant que tout soit vidé)
    // si on le laissait prioritaire, montrant le mauvais EntityResolver et
    // les mauvaises catégories. openDomain ne sert donc qu'à prévisualiser un
    // domaine tant qu'aucune contrainte n'existe (selectedStatIds vide).
    //
    // isClosed prime sur tout le reste : après "Réinitialiser ce contexte",
    // CE picker doit revenir au choix de domaine même si l'autre contexte
    // garde une sélection (donc rawConstraint non-null) — sinon le reset
    // n'aurait aucun effet visible tant que l'autre colonne a un graphe.
    const activeDomain = isClosed ? null : rawConstraint?.domain ?? openDomain ?? null;
    const effectiveScope: StatScope = lockedScope ?? localScope;

    const comparableForSelection = getComparableStats(STATS_CATALOG, selectionConstraint);
    const comparableInScope = activeDomain
        ? getComparableStats(STATS_CATALOG, { domain: activeDomain, scope: effectiveScope })
        : [];

    const EntityResolverComponent = activeDomain ? ENTITY_RESOLVERS[activeDomain] : undefined;

    // Même règle que useStatData (voir is-context-ready.ts) : une entité
    // choisie (scope entity) ou une législature choisie (scope aggregate)
    // avant de proposer quoi que ce soit à cocher — sinon un fetch avec des
    // paramètres incomplets ferait échouer la requête serveur.
    const isReady = activeDomain ? isContextReady(activeDomain, effectiveScope, context) : false;

    // Auto-coche la stat visée par StatSearch dès que le contexte devient
    // prêt (entité choisie / législature choisie) — sans ça, choisir un
    // résultat de recherche qui a besoin d'un EntityResolver ouvrirait
    // juste le bon domaine/scope sans jamais cocher quoi que ce soit tant
    // que l'utilisateur n'aurait pas re-cliqué la checkbox lui-même. Le
    // garde-fou domain/scope protège contre un changement manuel entre
    // temps (ex: l'utilisateur ouvre un autre domaine avant d'avoir choisi
    // son élément) qui rendrait pendingSelect périmé.
    useEffect(() => {
        if (!pendingSelect) return;
        // Déjà tiré pour CETTE sélection (id inchangé depuis le dernier
        // onToggleStat) : on ne retire plus jamais, même si l'utilisateur a
        // depuis décoché la stat à la main — c'est justement le cas qu'il
        // faut laisser décoché.
        if (firedPendingIdRef.current === pendingSelect.id) return;
        if (selectedStatIds.includes(pendingSelect.id)) return;
        if (!isReady) return;
        if (activeDomain !== pendingSelect.domain || effectiveScope !== pendingSelect.scope) return;

        firedPendingIdRef.current = pendingSelect.id;
        onToggleStat(pendingSelect.id);
    }, [pendingSelect, isReady, activeDomain, effectiveScope, selectedStatIds, onToggleStat]);

    const handleOpenDomain = (domain: StatDomain) => {
        if (!isComparing && rawConstraint && rawConstraint.domain !== domain) {
            onClearSelection();
        }
        setIsClosed(false);
        setOpenDomain(domain);
        setLocalScope("aggregate");
    };

    const handleSearchSelect = (stat: StatDefinition) => {
        if (!isComparing && rawConstraint && (rawConstraint.domain !== stat.domain || rawConstraint.scope !== stat.scope)) {
            onClearSelection();
        }
        setIsClosed(false);
        setOpenDomain(stat.domain);
        setLocalScope(stat.scope);
        // Déjà coché (résultat re-cliqué) : rien à attendre côté contexte.
        if (selectedStatIds.includes(stat.id)) {
            setPendingSelect(null);
        } else {
            // Nouvelle tentative de sélection — même si c'est la même stat
            // qu'une fois déjà "tirée" puis décochée à la main, elle doit
            // pouvoir se recocher cette fois (re-choisie explicitement).
            firedPendingIdRef.current = null;
            setPendingSelect({ id: stat.id, title: stat.title, domain: stat.domain, scope: stat.scope });
        }
    };

    // true seulement tant que CE picker attend encore le contexte requis par
    // une sélection faite via StatSearch — pilote à la fois le message et le
    // surlignage autour de l'EntityResolver (voir plus bas).
    const isAwaitingContextForPendingSelect =
        !!pendingSelect && !isReady && activeDomain === pendingSelect.domain && effectiveScope === pendingSelect.scope;

    const handleReset = () => {
        // L'affichage LOCAL de ce picker (isClosed) redémarre toujours à
        // vide — la décision de vider aussi selectedStatIds (partagé entre
        // les deux contextes) appartient au reducer via onReset
        // (RESET_CONTEXT), qui seul sait si TOUS les contextes sont
        // désormais vides.
        setIsClosed(true);
        setOpenDomain(null);
        setLocalScope("aggregate");
        setPendingSelect(null);
        onReset();
    };

    return (
        <div className="flex w-full flex-col gap-4 rounded-xl border border-main bg-surface-1 p-4">
            <StatSearch
                catalog={STATS_CATALOG}
                restrictToIds={isComparing ? new Set(comparableForSelection.map((stat) => stat.id)) : undefined}
                selectedStatIds={selectedStatIds}
                onSelect={handleSearchSelect}
            />

            <div className="flex items-center justify-between gap-3">
                <div className="flex flex-1 flex-wrap gap-3">
                    {STATS_CATALOG.map((module) => {
                        const availableInDomain = comparableForSelection.filter((stat) => stat.domain === module.id);
                        const isDisabled = availableInDomain.length === 0;
                        const isActive = activeDomain === module.id;

                        return (
                            <button
                                key={module.id}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => handleOpenDomain(module.id)}
                                className={`flex flex-1 min-w-[140px] flex-col items-center gap-2 rounded-xl border p-5 text-center transition-colors ${
                                    isActive ? "border-accent bg-surface-2" : "border-main bg-surface-1"
                                } ${isDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-surface-2"}`}
                            >
                                <module.icon className="h-6 w-6" style={{ color: isActive ? "var(--accent)" : "var(--subtitle-accent)" }} />
                                <span className="text-sm font-semibold">{module.label}</span>
                            </button>
                        );
                    })}
                </div>

                {(activeDomain || selectedStatIds.length > 0) && (
                    <ButtonLib
                        text={isComparing ? "Réinitialiser ce contexte" : "Réinitialiser"}
                        size="small"
                        variant="tertiary"
                        onClick={handleReset}
                    />
                )}
            </div>

            {activeDomain && (
                <div className="flex flex-col gap-4 border-t border-main pt-4">
                    {isAwaitingContextForPendingSelect && (
                        <p className="text-sm font-medium text-accent">
                            Choisis {effectiveScope === "entity" ? "un élément" : "une législature"} ci-dessous pour
                            charger « {pendingSelect!.title} ».
                        </p>
                    )}

                    {EntityResolverComponent && (
                        <div
                            className={
                                isAwaitingContextForPendingSelect
                                    ? "rounded-lg border-2 border-accent bg-surface-2 p-2"
                                    : undefined
                            }
                        >
                            <EntityResolverComponent
                                value={context}
                                scope={effectiveScope}
                                lockedScope={lockedScope}
                                otherContext={isComparing ? otherContext : null}
                                onChange={(newScope, params) => {
                                    if (!isComparing && rawConstraint && rawConstraint.scope !== newScope) {
                                        onClearSelection();
                                    }
                                    setLocalScope(newScope);
                                    onContextChange(params);
                                }}
                            />
                        </div>
                    )}

                    {isReady ? (
                        <div className="flex flex-col gap-2">
                            {groupStatsByCategory(comparableInScope).map((group) => (
                                <details
                                    key={group.category}
                                    // Toujours dépliée si elle contient une stat sélectionnée —
                                    // utile surtout en comparaison, où la catégorie d'un contexte
                                    // peut rester repliée alors qu'une stat y est déjà cochée
                                    // (sélection partagée entre les deux contextes).
                                    open={group.stats.some((stat) => selectedStatIds.includes(stat.id))}
                                    className="rounded-lg border border-main bg-surface-2 px-3 py-2"
                                >
                                    <summary className="cursor-pointer text-sm font-semibold text-subtitle-accent">
                                        {group.category}
                                    </summary>
                                    <div className="mt-2 flex flex-col gap-1.5 pl-1">
                                        {group.stats.map((stat) => (
                                            <CheckboxLib
                                                key={stat.id}
                                                isChecked={selectedStatIds.includes(stat.id)}
                                                onToggle={() => onToggleStat(stat.id)}
                                                label={stat.title}
                                            />
                                        ))}
                                    </div>
                                </details>
                            ))}
                            {comparableInScope.length === 0 && (
                                <p className="text-sm text-subtitle-accent">Aucune statistique disponible pour ce choix.</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-subtitle-accent">
                            {effectiveScope === "entity"
                                ? "Choisis d'abord un élément précis pour voir les statistiques disponibles."
                                : "Choisis d'abord une législature pour voir les statistiques disponibles."}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
