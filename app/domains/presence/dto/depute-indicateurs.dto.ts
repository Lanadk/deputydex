/** Indicateurs d'un député sur une législature (coloration des sièges de l'hémicycle). null = pas de valeur. */
export interface DeputeIndicateursDTO {
    uid: string;
    /** Jours attendus : un taux sur peu de jours est peu fiable (signalé dans l'info-bulle). */
    joursAttendus: number | null;
    tauxPresence: number | null;
    tauxPresenceSeance: number | null;
    tauxPresenceCommission: number | null;
    tauxParticipationScrutins: number | null;
}
