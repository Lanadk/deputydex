export function makeRegistryHelper<T extends { id: string }>(
    registry: readonly T[],
    registryName: string,
) {
    return (id: string): T => {
        const found = registry.find((item) => item.id === id);
        if (!found) {
            const available = registry.map((i) => `"${i.id}"`).join(", ");
            throw new Error(
                `[${registryName}] Entrée introuvable : "${id}".\n` +
                `Ids disponibles : ${available || "(registre vide)"}`,
            );
        }
        return found;
    };
}