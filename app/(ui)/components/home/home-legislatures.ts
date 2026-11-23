import { LegislatureDTO } from "@/app/domains/legislatures/dto/legislature.dto";

/** Législatures couvertes, de la plus ancienne à la plus récente. */
export function sortLegislaturesCouvertes(legislatures: LegislatureDTO[]): LegislatureDTO[] {
    return [...legislatures].sort((a, b) => a.number - b.number);
}

const ordinal = (numero: number) => `${numero}${numero === 1 ? "ʳᵉ" : "ᵉ"}`;

/** « 16ᵉ (2022 – 2024) », « 17ᵉ (depuis 2024) » ; sans date de début : « 15ᵉ ». */
export function periodeLegislature(legislature: LegislatureDTO): string {
    const debut = legislature.startDate?.slice(0, 4);
    if (!debut) return ordinal(legislature.number);
    const fin = legislature.endDate?.slice(0, 4);
    return `${ordinal(legislature.number)} (${fin ? `${debut} – ${fin}` : `depuis ${debut}`})`;
}

/** « a », « a et b », « a, b et c ». */
const enumerer = (items: string[]) =>
    items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;

/**
 * Phrase des législatures couvertes par Députédex :
 * « 2 législatures couvertes : la 16ᵉ (2022 – 2024) et la 17ᵉ (depuis 2024) ».
 * `null` sans législature.
 */
export function resumeLegislaturesCouvertes(legislatures: LegislatureDTO[]): string | null {
    if (!legislatures.length) return null;
    const periodes = sortLegislaturesCouvertes(legislatures).map((l) => `la ${periodeLegislature(l)}`);
    const nombre = legislatures.length;
    return `${nombre} législature${nombre > 1 ? "s" : ""} couverte${nombre > 1 ? "s" : ""} : ${enumerer(periodes)}`;
}
