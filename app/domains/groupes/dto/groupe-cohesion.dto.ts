export type GroupeCohesionDTO = {
    evolutionCohesionLegislature: {
        key: string;
        value: string |number | unknown;
    }[]
    tauxCohesionLegislature: number | null;
    nbScrutinsCouverts: number | null;
    tauxParticipationLegislature: number | null;
    tauxProximiteGouvernement: number | null;
}