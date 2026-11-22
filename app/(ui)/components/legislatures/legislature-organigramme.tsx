"use client";

import React, { useState } from "react";
import { OrgChartBadge, OrgChartLib, OrgChartNode } from "@/app/(ui)/component-library/molecules/org-chart/org-chart-lib";
import { getGroupCardTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import { TabsLib, tabPanelProps } from "@/app/(ui)/component-library/molecules/tabs/tabs-lib";
import { formatTimelineDate } from "@/app/(ui)/component-library/molecules/timeline/timeline-lib";
import {
    GouvernementDTO,
    LegislatureOrganisationDTO,
    PersonneFonctionDTO,
} from "@/app/domains/legislatures/dto/legislature-organisation.dto";

/** Pastille du groupe politique, aux couleurs du groupe. */
function badgeGroupe(groupe: PersonneFonctionDTO["groupe"]): OrgChartBadge | null {
    if (!groupe) return null;
    const theme = getGroupCardTheme(groupe.code);
    return { label: groupe.code, background: theme.badgeBg, color: theme.badgeText, title: `Groupe : ${groupe.libelle}` };
}

const personne = (p: PersonneFonctionDTO, subtitle: string = p.fonction): OrgChartNode => ({
    id: p.uid,
    title: p.nom,
    subtitle,
    href: p.href,
    avatar: { src: p.photoUrl },
    badge: badgeGroupe(p.groupe),
});

const periode = (g: GouvernementDTO) =>
    g.fin ? `du ${formatTimelineDate(g.debut)} au ${formatTimelineDate(g.fin)}` : `depuis le ${formatTimelineDate(g.debut)}`;

/** Exécutif : Président de la République → Premier ministre → membres du gouvernement, par rang. */
export function arbreExecutif(organisation: LegislatureOrganisationDTO, gouvernement: GouvernementDTO | undefined): OrgChartNode {
    const pr = organisation.presidence;
    const pm: OrgChartNode | null = gouvernement
        ? {
            ...personne(gouvernement.premierMinistre, `Premier ministre · ${gouvernement.libelle}, ${periode(gouvernement)}`),
            children: gouvernement.rangs.map((r) => ({
                id: `${gouvernement.id}-${r.rang}`,
                title: r.libelle,
                subtitle: `${r.membres.length} membre${r.membres.length > 1 ? "s" : ""}`,
                children: r.membres.map((m) => ({
                    ...personne(m),
                    id: `${gouvernement.id}-${r.rang}-${m.uid}`,
                    note: m.jusqua ? `jusqu'au ${formatTimelineDate(m.jusqua)}` : null,
                })),
            })),
        }
        : null;

    return {
        id: "presidence",
        title: pr ? pr.president : "Présidence de la République",
        subtitle: pr ? `Président de la République · ${pr.mandat} depuis le ${formatTimelineDate(pr.depuis)}` : null,
        children: pm ? [pm] : [],
    };
}

/** Assemblée : présidence → Bureau (vice-présidents, questeurs, secrétaires), présidents de groupe et de commission. */
export function arbreAssemblee(organisation: LegislatureOrganisationDTO): OrgChartNode {
    const a = organisation.assemblee;
    const branche = (id: string, title: string, nodes: OrgChartNode[]): OrgChartNode[] =>
        nodes.length ? [{ id, title, subtitle: `${nodes.length}`, children: nodes }] : [];

    const racine: OrgChartNode = a.president
        ? { ...personne(a.president, "Présidence de l'Assemblée nationale"), id: "assemblee" }
        : { id: "assemblee", title: "Assemblée nationale" };

    return {
        ...racine,
        children: [
            ...branche("vice-presidents", "Vice-présidences", a.vicePresidents.map((p) => personne(p, "Vice-présidence"))),
            ...branche("questeurs", "Questure", a.questeurs.map((p) => personne(p, "Questure"))),
            ...branche("secretaires", "Secrétariat du Bureau", a.secretaires.map((p) => personne(p, "Secrétariat"))),
            ...branche("groupes", "Présidences de groupe", a.presidentsGroupe.map((p) => personne(p, p.groupeLibelle ?? p.groupeCode ?? "Groupe"))),
            ...branche("commissions", "Présidences de commission permanente", a.presidentsCommission.map((p) => personne(p, p.commission))),
        ],
    };
}

/** Organigrammes de la législature : exécutif (un onglet par gouvernement) et Assemblée. */
export function LegislatureOrganigramme({ organisation }: { organisation: LegislatureOrganisationDTO }) {
    const gouvernements = organisation.gouvernements;
    const [gouvernementId, setGouvernementId] = useState(gouvernements[0]?.id ?? "");
    const gouvernement = gouvernements.find((g) => g.id === gouvernementId) ?? gouvernements[0];
    const prefix = `gouvernements-${organisation.legislature}`;

    return (
        <div className="flex flex-col gap-8">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-subtitle-accent">
                <span>
                    <span className="font-semibold text-accent underline underline-offset-2">Noms soulignés</span> : fiche du député sur Députédex.
                </span>
                <span>Pastille : groupe politique (au moment des faits pour un ministre ancien député).</span>
            </p>

            <section className="flex flex-col gap-3" aria-labelledby="organigramme-executif">
                <h3 id="organigramme-executif" className="text-lg font-semibold">Exécutif</h3>
                {gouvernements.length > 1 && (
                    <TabsLib
                        tabs={gouvernements.map((g) => ({ id: g.id, label: g.libelle }))}
                        activeId={gouvernement?.id ?? ""}
                        onChange={setGouvernementId}
                        ariaLabel="Gouvernements de la législature"
                        idPrefix={prefix}
                    />
                )}
                <div {...(gouvernement && gouvernements.length > 1 ? tabPanelProps(prefix, gouvernement.id) : {})}>
                    <OrgChartLib root={arbreExecutif(organisation, gouvernement)} ariaLabel="Organigramme de l'exécutif" showExpandControls />
                </div>
            </section>

            <section className="flex flex-col gap-3" aria-labelledby="organigramme-assemblee">
                <h3 id="organigramme-assemblee" className="text-lg font-semibold">Assemblée nationale</h3>
                <OrgChartLib root={arbreAssemblee(organisation)} ariaLabel="Organigramme de l'Assemblée nationale" showExpandControls />
            </section>
        </div>
    );
}
