export interface IGroupeCompositionRepository {
    getGroupeComposition(code: string, legislature: number): Promise<any>;
}