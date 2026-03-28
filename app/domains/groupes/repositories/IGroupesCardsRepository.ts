
export interface IGroupesCardsRepository {
    getGroupeCardsUseCase(legislature: number): Promise<any[]>;
}