const GROUPE_GOUVERNEMENT_REFERENCE_CODE_BY_LEGISLATURE: Record<number, string> = {
    16: 'RE',
    17: 'EPR',
};

export function getGroupeGouvernementReferenceCode(legislature: number): string | null {
    return GROUPE_GOUVERNEMENT_REFERENCE_CODE_BY_LEGISLATURE[legislature] ?? null;
}
