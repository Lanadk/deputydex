/** Liens vers les pages publiques de l'Assemblée nationale (assemblee-nationale.fr). */
const AN_BASE_URL = "https://www.assemblee-nationale.fr/dyn";

export function anDeputeUrl(acteurUid: string): string {
    return `${AN_BASE_URL}/deputes/${acteurUid}`;
}

export function anDossierUrl(legislature: number, dossierUid: string): string {
    return `${AN_BASE_URL}/${legislature}/dossiers/${dossierUid}`;
}

export function anAmendementUrl(legislature: number, amendementUid: string): string {
    return `${AN_BASE_URL}/${legislature}/amendements/${amendementUid}`;
}

export function anScrutinUrl(legislature: number, scrutinNumero: string): string {
    return `${AN_BASE_URL}/${legislature}/scrutins/${scrutinNumero}`;
}
