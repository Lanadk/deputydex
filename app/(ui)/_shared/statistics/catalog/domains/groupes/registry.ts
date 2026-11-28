import { defineStat } from "@/app/(ui)/_shared/statistics/catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";

// Branché sur de vraies tables agrégées (agg_groupes_stats_parite,
// agg_groupes_effectifs_legislature, agg_groupes_stats_cohesion_mensuelle),
// voir STAT_HANDLERS dans app/api/statistics/[domain]/[statId]/route.ts.

/** Méthodologie commune des stats de présence des groupes (vues `agg_groupes_presence*` de deputydex-data). */
const GROUPES_PRESENCE_METHODOLOGIE =
    "Jour attendu : séance publique avec au moins un scrutin public, ou convocation en commission d'un organe dont " +
    "le député est membre. Présent : vote personnel (hors délégation), prise de parole ou interruption en séance, " +
    "présence en commission. Chaque jour compte pour le groupe du député CE JOUR-LÀ ; taux pondéré (somme des jours " +
    "présents ÷ somme des jours attendus de tous les membres), pas la moyenne des taux individuels. « Toutes » : " +
    "chaque groupe de chaque législature à part (« RN · 16ᵉ »), sans fusion — un groupe n'est pas identifiable " +
    "d'une législature à l'autre (identifiants et sigles qui changent). Non inscrits " +
    "exclus du classement.";

/** Classement des groupes sur UNE composante de la présence (même colonne que `agg_assemblee_presence`). */
function presenceComposante(slug: string, title: string, description: string, calcul: string, keywords: string[]): StatDefinition {
    return defineStat("groupes", slug, {
        scope: "aggregate",
        title,
        category: "Présence",
        keywords: ["présence", "tous les groupes", ...keywords],
        description,
        methodology: GROUPES_PRESENCE_METHODOLOGIE + " " + calcul,
        dataShape: "distribution",
        excludedDisplayTypes: ["pie", "donut"],
        unit: "%",
        chartVariant: "parliament-group",
        allLegislatures: true,
    });
}

export const GROUPES_STATS: StatDefinition[] = [
    defineStat("groupes", "parite", {
        scope: "entity",
        title: "Parité au sein du groupe",
        category: "Composition",
        keywords: ["parité", "genre", "groupe", "composition"],
        description: "Indique l'équilibre entre hommes et femmes au sein de ce groupe parlementaire précis.",
        methodology: "Répartition par genre déclaré des membres du groupe sélectionné.",
        dataShape: "distribution",
        unit: "%",
        entityIdLabel: "Choisir un groupe",
        // PAS de chartVariant "parliament-group" ici : les items sont
        // "Hommes"/"Femmes", pas des groupes — le variant les colorerait
        // tous les deux en gris par défaut (aucune correspondance trouvée),
        // ce qui est pire que la palette générique.
    }),
    defineStat("groupes", "effectifs", {
        scope: "aggregate",
        title: "Effectifs par groupe",
        category: "Composition",
        keywords: ["effectifs", "taille", "membres", "tous les groupes"],
        description: "Compare la taille des différents groupes parlementaires pour situer leur poids respectif à l'Assemblée.",
        methodology: "Nombre de membres actuellement recensés (dernière composition connue), par groupe parlementaire.",
        dataShape: "distribution",
        unit: "membres",
        // Un item par groupe (label = code/libellé du groupe) — le cas
        // d'usage exact du variant.
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "cumul-mandats", {
        scope: "aggregate",
        title: "Ancienneté moyenne par groupe",
        category: "Composition",
        keywords: ["ancienneté", "mandat", "cumul", "expérience", "tous les groupes"],
        description: "Ancienneté moyenne à l'Assemblée des membres actuels de chaque groupe parlementaire.",
        methodology: "Pour chaque membre actuel du groupe : somme des durées de ses appartenances à un groupe parlementaire, sur toutes les législatures présentes dans la base (l'ancienneté est donc bornée par la profondeur historique des données) ; puis moyenne par groupe. Non inscrits et groupes sans membre actuel exclus.",
        dataShape: "distribution",
        excludedDisplayTypes: ["pie", "donut"],
        unit: "ans",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "cohesion", {
        scope: "entity",
        title: "Évolution de la cohésion",
        category: "Cohésion",
        keywords: ["cohésion", "vote", "évolution", "groupe"],
        description: "Montre si les membres de ce groupe votent de plus en plus, ou de moins en moins, dans le " +
            "même sens au fil des mois.",
        methodology: "Taux de cohésion de vote du groupe sélectionné, calculé mois par mois sur la législature en cours.",
        dataShape: "timeseries",
        unit: "%",
        entityIdLabel: "Choisir un groupe",
        // Une seule série = le groupe sélectionné — colore la courbe avec sa
        // couleur (voir StatViewer, qui résout le code du groupe depuis le
        // contexte pour le passer en `groupLabel`).
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "cohesion-legislature", {
        scope: "aggregate",
        title: "Cohésion des groupes",
        category: "Cohésion",
        keywords: ["cohésion", "vote", "tous les groupes"],
        description: "Compare, pour chaque groupe parlementaire, à quel point ses membres votent dans le même sens.",
        methodology: "Score de cohésion moyen sur l'ensemble de la législature (moyenne non pondérée des taux de cohésion par scrutin, scrutins avec moins de 5 votants du groupe exclus), par groupe — les groupes sans membre actuel (renommés/dissous en cours de législature) sont exclus.",
        dataShape: "distribution",
        excludedDisplayTypes: ["pie", "donut"],
        unit: "%",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "cohesion-evolution-groupes", {
        scope: "aggregate",
        title: "Évolution de la cohésion, tous groupes",
        category: "Cohésion",
        keywords: ["cohésion", "évolution", "tous les groupes"],
        description: "Compare, mois par mois, la cohésion de vote de tous les groupes parlementaires de la législature.",
        methodology: "Taux de cohésion mensuel de chaque groupe (scrutins avec moins de 5 votants du groupe exclus). Un groupe renommé/dissous en cours de législature (ex: SOC-NUPES → SOC) apparaît comme deux séries distinctes, chacune sur sa propre période.",
        dataShape: "multi-series",
        unit: "%",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "positions-de-vote", {
        scope: "aggregate",
        title: "Positions de vote par groupe",
        category: "Votes",
        keywords: ["positions", "vote", "pour", "contre", "abstention", "tous les groupes"],
        description: "Compare, pour chaque groupe parlementaire, la part de votes exprimés pour / contre / en abstention sur l'ensemble des scrutins politiques.",
        methodology: "Pour chaque groupe : part de ses votes qui sont \"pour\" / \"contre\" / \"abstention\", sur le total de ses votes exprimés (pour + contre + abstention) de la législature — non-votants exclus du calcul. Les groupes sans membre actuel (renommés/dissous en cours de législature) sont exclus.",
        dataShape: "multi-series",
        unit: "%",
        // Un item par groupe (nom de série = code/libellé du groupe) — même
        // cas d'usage que groupes.effectifs.
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "expression-votes", {
        scope: "aggregate",
        title: "Taux d'expression aux scrutins",
        category: "Votes",
        keywords: ["expression", "participation", "scrutins", "tous les groupes"],
        description: "\"S'exprimer\" = voter une position politique (pour, contre OU abstention), peu importe laquelle — à l'opposé d'être non-votant (absent, ou volontairement non-votant). Un groupe peut s'exprimer beaucoup tout en s'abstenant souvent : voter \"abstention\" compte comme s'exprimer, contrairement à ne pas voter du tout.",
        methodology: "Pour chaque groupe : (nombre de votes pour + contre + abstention) / (pour + contre + abstention + non-votants), sur l'ensemble des scrutins de la législature — les groupes sans membre actuel (renommés/dissous en cours de législature) sont exclus. Différent de \"Taux de participation\" (groupes.participation) : ici la base de calcul est le total des POSITIONS observées sur les scrutins couverts, pas l'éligibilité individuelle de chaque député·e reconstituée scrutin par scrutin.",
        dataShape: "distribution",
        excludedDisplayTypes: ["pie", "donut"],
        unit: "%",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "participation", {
        scope: "aggregate",
        title: "Taux de participation aux scrutins",
        category: "Votes",
        keywords: ["participation", "présence", "scrutins", "tous les groupes"],
        description: "Compare, pour chaque groupe parlementaire, la part des scrutins auxquels ses membres ont effectivement pris part (pour, contre ou abstention) parmi ceux où ils étaient éligibles à voter.",
        methodology: "Moyenne pondérée par le nombre de scrutins éligibles (pas une moyenne simple des mois), par groupe, sur la législature — les groupes sans membre actuel (renommés/dissous en cours de législature) sont exclus.",
        dataShape: "distribution",
        excludedDisplayTypes: ["pie", "donut"],
        unit: "%",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "participation-evolution", {
        scope: "entity",
        title: "Évolution de la participation",
        category: "Votes",
        keywords: ["participation", "évolution", "groupe"],
        description: "Montre si les membres de ce groupe participent de plus en plus, ou de moins en moins, aux scrutins au fil des mois.",
        methodology: "Taux de participation moyen des député·es du groupe sélectionné (scrutins effectivement votés parmi ceux où ils étaient éligibles), calculé mois par mois. Un groupe renommé/dissous en cours de législature (ex: UDR → UDDPLR, SOC-NUPES → SOC) apparaît sous plusieurs codes distincts, chacun avec sa propre période — ce n'est pas un artefact, choisir l'un ou l'autre montre la période correspondante.",
        dataShape: "timeseries",
        unit: "%",
        entityIdLabel: "Choisir un groupe",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "participation-evolution-groupes", {
        scope: "aggregate",
        title: "Évolution de la participation, tous groupes",
        category: "Votes",
        keywords: ["participation", "évolution", "tous les groupes"],
        description: "Compare, mois par mois, le taux de participation aux scrutins de tous les groupes parlementaires de la législature.",
        methodology: "Taux de participation moyen des député·es, calculé mois par mois pour chaque groupe. Un groupe renommé/dissous en cours de législature (ex: SOC-NUPES → SOC) apparaît comme deux séries distinctes, chacune sur sa propre période.",
        dataShape: "multi-series",
        unit: "%",
        chartVariant: "parliament-group",
    }),

    // ── Présence ──────────────────────────────────────────────────────────
    defineStat("groupes", "presence", {
        scope: "aggregate",
        allLegislatures: true,
        title: "Taux de présence par groupe",
        category: "Présence",
        keywords: ["présence", "assiduité", "absence", "tous les groupes"],
        description: "Compare, pour chaque groupe, la part des jours où ses député·es étaient attendu·es (séance avec vote, convocation en commission) où ils ont effectivement été présents.",
        methodology: GROUPES_PRESENCE_METHODOLOGIE,
        dataShape: "distribution",
        excludedDisplayTypes: ["pie", "donut"],
        unit: "%",
        chartVariant: "parliament-group",
    }),
    presenceComposante(
        "presence-seance",
        "Présence en séance, par groupe",
        "Compare, pour chaque groupe, la part des jours de séance avec scrutin où ses député·es en mandat ont été vu·es dans l'hémicycle.",
        "Taux = jours de séance avec au moins un scrutin public où le député a voté personnellement, pris la parole, interrompu ou présidé ÷ jours de séance avec scrutin pendant son mandat. Les commissions ne comptent pas.",
        ["séance", "hémicycle"],
    ),
    presenceComposante(
        "presence-commission",
        "Présence en commission, par groupe",
        "Compare, pour chaque groupe, la part des réunions de commission où ses député·es membres ont été noté·es présent·es.",
        "Taux = réunions où le député est noté présent ÷ réunions de ses organes (commissions, délégations…) auxquelles il était convoqué. Compté en réunions, pas en jours ; les présents non membres ne comptent pas.",
        ["commission", "réunion"],
    ),
    presenceComposante(
        "presence-excuses-commission",
        "Excusés en commission, par groupe",
        "Compare, pour chaque groupe, la part des réunions de commission où ses député·es membres se sont excusé·es.",
        "Taux = réunions où le député est noté excusé ÷ réunions de ses organes auxquelles il était convoqué. Un excusé n'est pas présent : il est aussi au dénominateur du taux de présence en commission.",
        ["commission", "excusé", "absence"],
    ),
    presenceComposante(
        "presence-scrutins",
        "Participation aux scrutins, par groupe",
        "Compare, pour chaque groupe, la part des scrutins publics auxquels ses député·es ont pris part personnellement, pendant leur mandat.",
        "Taux = votes personnels (pour, contre, abstention, hors délégation) ÷ scrutins publics tenus pendant le mandat. Une journée peut compter des centaines de scrutins : ce taux est bien plus bas que la présence en séance.",
        ["scrutin", "vote", "participation"],
    ),
    defineStat("groupes", "presence-composantes", {
        scope: "aggregate",
        allLegislatures: true,
        title: "Présence par groupe : séance, commission, scrutins",
        category: "Présence",
        keywords: ["présence", "séance", "commission", "scrutins", "excusés", "tous les groupes"],
        description: "Met côte à côte, pour chaque groupe, la présence en séance, en commission, les excusés et la participation aux scrutins.",
        methodology: GROUPES_PRESENCE_METHODOLOGIE + " Une série par composante (même calcul que les classements « Présence en séance / en commission / Excusés / Participation aux scrutins, par groupe »).",
        dataShape: "multi-series",
        unit: "%",
    }),
    defineStat("groupes", "presence-jours-par-mois", {
        scope: "aggregate",
        allLegislatures: true,
        title: "Jours de présence par mois, par groupe",
        category: "Présence",
        keywords: ["présence", "jours", "volume", "tous les groupes"],
        description: "Jours de présence par mois d'un·e député·e de chaque groupe, en moyenne — toutes sources confondues (vote, prise de parole, commission).",
        methodology: GROUPES_PRESENCE_METHODOLOGIE + " Volume : jours de présence (attendus ou non, un jour compté une fois) ÷ mois-députés actifs (mois avec une séance ou un jour attendu).",
        dataShape: "distribution",
        excludedDisplayTypes: ["pie", "donut"],
        unit: "jours / mois",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "presence-evolution", {
        scope: "entity",
        title: "Évolution de la présence",
        category: "Présence",
        keywords: ["présence", "évolution", "mensuel", "groupe"],
        description: "Mois par mois, la part des jours attendus où les député·es de ce groupe ont été présent·es.",
        methodology: GROUPES_PRESENCE_METHODOLOGIE,
        dataShape: "timeseries",
        unit: "%",
        entityIdLabel: "Choisir un groupe",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "presence-evolution-groupes", {
        scope: "aggregate",
        allLegislatures: true,
        title: "Évolution de la présence, tous groupes",
        category: "Présence",
        keywords: ["présence", "évolution", "mensuel", "tous les groupes"],
        description: "Compare, mois par mois, le taux de présence de tous les groupes de la législature.",
        methodology: GROUPES_PRESENCE_METHODOLOGIE + " Un groupe renommé/dissous en cours de législature apparaît comme plusieurs séries, chacune sur sa période.",
        dataShape: "multi-series",
        unit: "%",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "presence-annee-civile", {
        scope: "aggregate",
        allLegislatures: true,
        title: "Présence par année civile, par groupe",
        category: "Présence",
        keywords: ["présence", "année", "civile", "jours", "tous les groupes"],
        description: "Jours de présence par mois d'un·e député·e, en moyenne, pour chaque groupe et chaque année civile (janvier → décembre).",
        methodology: GROUPES_PRESENCE_METHODOLOGIE + " Valeur = jours de présence ÷ mois-députés actifs de l'année.",
        dataShape: "multi-series",
        unit: "jours / mois",
        chartVariant: "parliament-group",
    }),
    defineStat("groupes", "presence-annee-parlementaire", {
        scope: "aggregate",
        allLegislatures: true,
        title: "Présence par année parlementaire, par groupe",
        category: "Présence",
        keywords: ["présence", "année", "parlementaire", "session", "jours", "tous les groupes"],
        description: "Jours de présence par mois d'un·e député·e, en moyenne, pour chaque groupe et chaque année parlementaire (1er octobre → 30 septembre).",
        methodology: GROUPES_PRESENCE_METHODOLOGIE + " Valeur = jours de présence ÷ mois-députés actifs de l'année.",
        dataShape: "multi-series",
        unit: "jours / mois",
        chartVariant: "parliament-group",
    }),
];
