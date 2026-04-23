export type GroupeInfosEntity = {
    legislature: number;
    groupe_id: string;
    groupe_label: string;
    groupe_code: string;
    groupe_position: 'Droite' | 'Centre' | 'Gauche';
    groupe_count_members: number;
    groupe_rank: number;
    groupe_year_of_creation: string;
    groupe_web_site: string;
    groupe_president_full_name: string;
    groupe_quality_sex_label: string;
    groupe_seats_share_percent: number;
}