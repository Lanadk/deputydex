export function toISODateOnly(d: Date | null | undefined): string | null {
    if (!d) return null;
    // yyyy-mm-dd
    return d.toISOString().slice(0, 10);
}