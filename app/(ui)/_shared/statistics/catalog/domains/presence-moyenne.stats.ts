import { defineStat } from "@/app/(ui)/_shared/statistics/catalog/define-stat";
import { StatDefinition } from "@/app/(ui)/_shared/statistics/catalog/stat-definition.types";
import { StatDomain } from "@/app/_shared/statistics/stat-scope.types";

/**
 * Méthodologie commune des stats de présence (vues `agg_*_presence*` de
 * deputydex-data — démarche complète dans
 * `deputydex-data/src/sql/scripts/presence/README.md`).
 */
export const PRESENCE_METHODOLOGIE =
    "Un jour est « attendu » pendant le mandat quand une séance publique avec au moins un scrutin public " +
    "s'est tenue, ou quand le député est convoqué à une réunion (commission…) d'un organe dont il est membre. " +
    "Il est « présent » s'il a voté personnellement (les votes par délégation, émis par un collègue, ne comptent " +
    "pas), pris la parole ou interrompu en séance, ou été noté présent en commission. Les séances sans aucun vote " +
    "(questions au Gouvernement, semaines de contrôle) ne permettent de voir que les orateurs : elles ne sont pas " +
    "attendues, mais y parler compte comme jour de présence. Borne basse : un député présent qui ne vote ni ne parle n'est pas vu.";

const MOYENNE_METHODOLOGIE =
    PRESENCE_METHODOLOGIE + " Moyenne de tous les députés de la législature choisie : taux pondérés (somme des " +
    "jours présents ÷ somme des jours attendus de tous les députés), pas la moyenne des taux individuels.";

const MOYENNE_ANNEES =
    " Année civile : janvier → décembre. Année parlementaire : 1er octobre → 30 septembre, comme les sessions " +
    "(juillet–septembre 2024, début de la 17ᵉ, relève de « 2023-2024 »). Année de mandat : rang de l'année " +
    "dans le mandat de CHAQUE député, depuis sa propre prise de fonction (un remplaçant arrivé en cours de route " +
    "compte dans « année 1 » pour ses 12 premiers mois).";

type TypeAnnee = "civile" | "parlementaire" | "mandat";

function annee(domain: StatDomain, type: TypeAnnee, mesure: "taux" | "jours"): StatDefinition {
    const libelle = { civile: "année civile", parlementaire: "année parlementaire", mandat: "année de mandat" }[type];
    return defineStat(domain, `presence-moyenne-${mesure}-annee-${type}`, {
        scope: "aggregate",
        title: mesure === "taux" ? `Taux de présence moyen par ${libelle}` : `Jours de présence par mois, par ${libelle}`,
        category: "Présence",
        keywords: ["présence", "moyenne", "année", type, mesure === "taux" ? "taux" : "jours", "députés"],
        description: mesure === "taux"
            ? `La part des jours attendus où les député·es ont été présent·es, ${libelle} par ${libelle}.`
            : `Combien de jours par mois un·e député·e est présent·e en moyenne, ${libelle} par ${libelle} — toutes sources confondues.`,
        methodology: MOYENNE_METHODOLOGIE + MOYENNE_ANNEES + (mesure === "jours"
            ? " Valeur = jours de présence (attendus ou non, un jour compté une fois) ÷ mois-députés actifs (mois avec une séance ou un jour attendu) : une année entamée reste comparable à une année complète."
            : ""),
        dataShape: "timeseries",
        unit: mesure === "taux" ? "%" : "jours / mois",
    });
}

/**
 * Présence moyenne de tous les députés d'UNE législature — mêmes stats dans
 * deux domaines du mode avancé (`acteurs` → « Tous les députés », et
 * `legislatures`), mêmes handlers côté serveur
 * (`api/statistics/_handlers/presence-moyenne.handlers.ts`).
 */
export function presenceMoyenneStats(domain: StatDomain): StatDefinition[] {
    return [
        defineStat(domain, "presence-moyenne", {
            scope: "aggregate",
            title: "Présence moyenne : séance, commission, scrutins",
            category: "Présence",
            keywords: ["présence", "moyenne", "séance", "commission", "scrutins", "excusés", "députés"],
            description: "Le taux de présence moyen des député·es et ses composantes : présence en séance, en commission (et excusés), participation aux scrutins.",
            methodology: MOYENNE_METHODOLOGIE + " Séance : jours de séance avec scrutin. Commission : présences et excuses parmi les convocations de membres. Scrutins : votes personnels parmi tous les scrutins publics des jours de mandat (une journée peut en compter des centaines).",
            dataShape: "multi-series",
            unit: "%",
        }),
        defineStat(domain, "presence-moyenne-evolution", {
            scope: "aggregate",
            title: "Taux de présence moyen, mois par mois",
            category: "Présence",
            keywords: ["présence", "moyenne", "évolution", "mensuel", "députés"],
            description: "Mois par mois, la part des jours attendus où les député·es ont été présent·es.",
            methodology: MOYENNE_METHODOLOGIE + " Un mois sans séance avec vote ne reflète que les commissions.",
            dataShape: "timeseries",
            unit: "%",
        }),
        defineStat(domain, "presence-moyenne-jours-mensuels", {
            scope: "aggregate",
            title: "Jours de présence moyens, mois par mois",
            category: "Présence",
            keywords: ["présence", "moyenne", "jours", "volume", "mensuel", "députés"],
            description: "Combien de jours, chaque mois, un·e député·e est présent·e en moyenne — toutes sources confondues : vote, prise de parole, commission.",
            methodology: MOYENNE_METHODOLOGIE + " Jours de présence (attendus ou non, un jour compté une fois) ÷ députés actifs du mois.",
            dataShape: "timeseries",
            unit: "jours",
        }),
        defineStat(domain, "presence-moyenne-journaliere", {
            scope: "aggregate",
            title: "Taux de présence, jour par jour",
            category: "Présence",
            keywords: ["présence", "moyenne", "jour", "quotidien", "séance", "députés"],
            description: "Pour chaque jour de séance avec au moins un scrutin public : la part des député·es en mandat présent·es en séance, et la part des député·es attendu·es présent·es en séance ou en commission.",
            methodology: MOYENNE_METHODOLOGIE + " En séance : vote personnel, prise de parole, interruption ou présidence, parmi tous les députés en mandat. Séance ou commission : parmi les députés attendus ce jour-là. Jours de commission seule exclus (seuls les membres convoqués y sont attendus).",
            dataShape: "multi-series",
            unit: "%",
        }),
        defineStat(domain, "presence-moyenne-deputes-presents", {
            scope: "aggregate",
            title: "Nombre de député·es présent·es, jour par jour",
            category: "Présence",
            keywords: ["présence", "nombre", "jour", "quotidien", "députés"],
            description: "Combien de député·es ont été vu·es présent·es (vote, prise de parole, commission), chaque jour de séance avec au moins un scrutin public.",
            methodology: MOYENNE_METHODOLOGIE + " Tous les députés présents ce jour-là, attendus ou non, comptés une fois.",
            dataShape: "timeseries",
            unit: "députés",
        }),
        defineStat(domain, "presence-moyenne-jour-semaine", {
            scope: "aggregate",
            title: "Taux de présence moyen selon le jour de la semaine",
            category: "Présence",
            keywords: ["présence", "moyenne", "semaine", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "députés"],
            description: "Le rythme de la semaine parlementaire : la présence est la plus forte le mardi et le mercredi (votes solennels, questions au Gouvernement), plus faible le lundi et le vendredi (circonscription).",
            methodology: MOYENNE_METHODOLOGIE,
            dataShape: "multi-series",
            unit: "%",
        }),
        annee(domain, "civile", "taux"),
        annee(domain, "parlementaire", "taux"),
        annee(domain, "mandat", "taux"),
        annee(domain, "civile", "jours"),
        annee(domain, "parlementaire", "jours"),
        annee(domain, "mandat", "jours"),
    ];
}
