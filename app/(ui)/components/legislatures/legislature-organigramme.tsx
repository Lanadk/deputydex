"use client";

import React, { useState } from "react";
import { OrgChartBadge, OrgChartInfo, OrgChartLayout, OrgChartLib, OrgChartNode } from "@/app/(ui)/component-library/molecules/org-chart/org-chart-lib";
import { getGroupCardTheme } from "@/app/(ui)/theme/parliament-groups/group-theme.helpers";
import { TabsLib, tabPanelProps } from "@/app/(ui)/component-library/molecules/tabs/tabs-lib";
import { formatJourFr } from "@/app/_shared/utils/date";
import {
    AssembleeOrganisationDTO,
    FonctionAssembleeDTO,
    GouvernementDTO,
    LegislatureOrganisationDTO,
    PersonneFonctionDTO,
    PhotoCreditDTO,
} from "@/app/domains/legislatures/dto/legislature-organisation.dto";

/** Pastille du groupe politique, aux couleurs du groupe. */
function badgeGroupe(groupe: PersonneFonctionDTO["groupe"]): OrgChartBadge | null {
    if (!groupe) return null;
    const theme = getGroupCardTheme(groupe.code);
    return { label: groupe.code, background: theme.badgeBg, color: theme.badgeText, title: `Groupe : ${groupe.libelle}` };
}

type Definitions = LegislatureOrganisationDTO["definitions"];

/** Bulle de définition d'une fonction (référentiel), si elle est connue. */
export function infoFonction(definitions: Definitions, slug: string): OrgChartInfo | null {
    const d = definitions[slug];
    if (!d) return null;
    return {
        subject: d.libelle,
        content: (
            <>
                <span className="block">{d.definition}</span>
                {d.source && <span className="mt-1 block text-xs text-subtitle-accent">Source : {d.source}</span>}
            </>
        ),
    };
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
    g.fin ? `du ${formatJourFr(g.debut)} au ${formatJourFr(g.fin)}` : `depuis le ${formatJourFr(g.debut)}`;

/** Exécutif : Président de la République → Premier ministre → membres du gouvernement, par rang. */
export function arbreExecutif(organisation: LegislatureOrganisationDTO, gouvernement: GouvernementDTO | undefined): OrgChartNode {
    const pr = organisation.presidence;
    const definitions = organisation.definitions;
    const pm: OrgChartNode | null = gouvernement
        ? {
            ...personne(gouvernement.premierMinistre, `Premier ministre · ${gouvernement.libelle}, ${periode(gouvernement)}`),
            info: infoFonction(definitions, "premier-ministre"),
            children: gouvernement.rangs.map((r) => ({
                id: `${gouvernement.id}-${r.rang}`,
                variant: "group" as const,
                title: r.libelle,
                subtitle: `${r.membres.length}`,
                // Les clés des rangs (`ministre-delegue`…) sont celles du référentiel.
                info: infoFonction(definitions, r.rang),
                children: r.membres.map((m) => ({
                    ...personne(m),
                    id: `${gouvernement.id}-${r.rang}-${m.uid}`,
                    note: m.jusqua ? `jusqu'au ${formatJourFr(m.jusqua)}` : null,
                })),
            })),
        }
        : null;

    return {
        id: "presidence",
        title: pr ? pr.president : "Présidence de la République",
        subtitle: pr ? `Président de la République · ${pr.mandat} depuis le ${formatJourFr(pr.depuis)}` : null,
        avatar: pr ? { src: pr.photoUrl } : null,
        info: infoFonction(definitions, "president-republique"),
        children: pm ? [pm] : [],
    };
}

/** Une fonction à l'Assemblée, avec sa date de départ si elle a été quittée en cours de session. */
const fonctionAssemblee = (branche: string, p: FonctionAssembleeDTO, subtitle: string): OrgChartNode => ({
    ...personne(p, subtitle),
    // Une même personne peut figurer dans deux branches (ex. présidente de groupe puis de commission).
    id: `${branche}-${p.uid}`,
    note: p.jusqua ? `jusqu'au ${formatJourFr(p.jusqua)}` : null,
});

/** Assemblée, pendant une session : présidence → Bureau (vice-présidents, questeurs, secrétaires), présidents de groupe et de commission. */
export function arbreAssemblee(session: AssembleeOrganisationDTO, definitions: Definitions = {}): OrgChartNode {
    // `slug` : clé de la définition de la fonction dans le référentiel.
    const branche = (id: string, title: string, slug: string, nodes: OrgChartNode[]): OrgChartNode[] =>
        nodes.length ? [{ id, variant: "group", title, subtitle: `${nodes.length}`, info: infoFonction(definitions, slug), children: nodes }] : [];

    const racine: OrgChartNode = session.president
        ? { ...fonctionAssemblee("presidence", session.president, "Présidence de l'Assemblée nationale"), id: "assemblee" }
        : { id: "assemblee", title: "Assemblée nationale" };

    return {
        ...racine,
        info: infoFonction(definitions, "assemblee-president"),
        children: [
            ...branche("vice-presidents", "Vice-présidences", "assemblee-vice-president", session.vicePresidents.map((p) => fonctionAssemblee("vp", p, "Vice-présidence"))),
            ...branche("questeurs", "Questure", "assemblee-questeur", session.questeurs.map((p) => fonctionAssemblee("questeur", p, "Questure"))),
            ...branche("secretaires", "Secrétariat du Bureau", "assemblee-secretaire", session.secretaires.map((p) => fonctionAssemblee("secretaire", p, "Secrétariat"))),
            ...branche("groupes", "Présidences de groupe", "assemblee-president-groupe", session.presidentsGroupe.map((p) => fonctionAssemblee(`gp-${p.groupeCode}`, p, p.groupeLibelle ?? p.groupeCode ?? "Groupe"))),
            ...branche("commissions", "Présidences de commission permanente", "assemblee-president-commission", session.presidentsCommission.map((p) => fonctionAssemblee(`com-${p.commission}`, p, p.commission))),
        ],
    };
}

type CreditPhoto = { nom: string; credit: PhotoCreditDTO };

/** Crédits des portraits tiers affichés dans l'organigramme de l'exécutif (une fois par personne). */
export function creditsExecutif(organisation: LegislatureOrganisationDTO, gouvernement: GouvernementDTO | undefined): CreditPhoto[] {
    const credits = new Map<string, CreditPhoto>();
    const pr = organisation.presidence;
    if (pr?.photoCredit) credits.set(pr.president, { nom: pr.president, credit: pr.photoCredit });
    const personnes = gouvernement ? [gouvernement.premierMinistre, ...gouvernement.rangs.flatMap((r) => r.membres)] : [];
    for (const p of personnes) if (p.photoCredit) credits.set(p.nom, { nom: p.nom, credit: p.photoCredit });
    return [...credits.values()];
}

function CreditsPhotos({ credits }: { credits: CreditPhoto[] }) {
    if (!credits.length) return null;
    return (
        <p className="text-xs text-subtitle-accent">
            Crédits photo :{" "}
            {credits.map(({ nom, credit }, i) => (
                <React.Fragment key={nom}>
                    {i > 0 && " · "}
                    {nom} : {credit.auteur} (
                    {credit.licenceUrl
                        ? <a href={credit.licenceUrl} className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">{credit.licence}</a>
                        : credit.licence}
                    )
                </React.Fragment>
            ))}
            .
        </p>
    );
}

type Institution = "executif" | "assemblee";

const INSTITUTIONS: { id: Institution; label: string }[] = [
    { id: "assemblee", label: "Assemblée nationale" },
    { id: "executif", label: "Exécutif" },
];

/** Ligne d'onglets (un par période) de l'organigramme, ou une ligne vide réservée s'il n'y a qu'une période. */
function ongletsPeriodes(
    periodes: { id: string; libelle: string }[],
    activeId: string,
    onChange: (id: string) => void,
    ariaLabel: string,
    idPrefix: string
) {
    if (periodes.length < 2) return { toolbar: null, treeProps: undefined };
    return {
        toolbar: <TabsLib tabs={periodes.map((p) => ({ id: p.id, label: p.libelle }))} activeId={activeId} onChange={onChange} ariaLabel={ariaLabel} idPrefix={idPrefix} />,
        treeProps: tabPanelProps(idPrefix, activeId),
    };
}

/**
 * Organigrammes de la législature, un onglet par institution : l'Assemblée
 * nationale (un onglet par session), puis l'exécutif (un onglet par gouvernement).
 */
export function LegislatureOrganigramme({ organisation }: { organisation: LegislatureOrganisationDTO }) {
    const [institution, setInstitution] = useState<Institution>("assemblee");
    // Affichage choisi conservé d'un onglet à l'autre (institution, gouvernement, session).
    const [layout, setLayout] = useState<OrgChartLayout>("arbre");
    const affichage = { layout, onLayoutChange: setLayout, showLayoutToggle: true, showExpandControls: true };
    const gouvernements = organisation.gouvernements;
    const [gouvernementId, setGouvernementId] = useState(gouvernements[0]?.id ?? "");
    const gouvernement = gouvernements.find((g) => g.id === gouvernementId) ?? gouvernements[0];
    const sessions = organisation.sessions;
    const [sessionId, setSessionId] = useState(sessions[0]?.id ?? "");
    const session = sessions.find((s) => s.id === sessionId) ?? sessions[0];
    const prefixInstitutions = `organigramme-${organisation.legislature}`;

    // Onglets des périodes sur la ligne réservée au-dessus des boutons « Tout déplier / replier » :
    // vide quand il n'y a qu'une période, elle garde les boutons à la même place d'un onglet à l'autre.
    const ongletsGouvernements = ongletsPeriodes(gouvernements, gouvernement?.id ?? "", setGouvernementId,
        "Gouvernements de la législature", `gouvernements-${organisation.legislature}`);
    const ongletsSessions = ongletsPeriodes(sessions, session?.id ?? "", setSessionId,
        "Sessions de l'Assemblée", `sessions-${organisation.legislature}`);

    return (
        <div className="flex flex-col gap-6">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-subtitle-accent">
                <span>
                    <span className="font-semibold text-accent underline underline-offset-2">Noms soulignés</span> : fiche du député sur Députédex.
                </span>
                <span>Pastille : groupe politique (au moment des faits pour un ministre ancien député).</span>
            </p>

            <TabsLib
                tabs={INSTITUTIONS}
                activeId={institution}
                onChange={(id) => setInstitution(id as Institution)}
                ariaLabel="Institution présentée"
                idPrefix={prefixInstitutions}
                variant="segmented"
                fullWidth
            />

            <div {...tabPanelProps(prefixInstitutions, institution)} className="flex flex-col gap-3">
                {institution === "executif" ? (
                    <>
                        <OrgChartLib
                            root={arbreExecutif(organisation, gouvernement)}
                            ariaLabel="Organigramme de l'exécutif"
                            {...affichage}
                            {...ongletsGouvernements}
                        />
                        <CreditsPhotos credits={creditsExecutif(organisation, gouvernement)} />
                    </>
                ) : (
                    session
                        ? <OrgChartLib root={arbreAssemblee(session, organisation.definitions)} ariaLabel="Organigramme de l'Assemblée nationale" {...affichage} {...ongletsSessions} />
                        : <p className="text-sm text-subtitle-accent">Aucune fonction à l&apos;Assemblée connue pour cette législature.</p>
                )}
            </div>
        </div>
    );
}
