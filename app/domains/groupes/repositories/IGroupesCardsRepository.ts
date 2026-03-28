
export interface IGroupesCardsRepository {
    getGroupesCards(legislature: number): Promise<any[]>;
}