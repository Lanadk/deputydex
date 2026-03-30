
export interface IGroupeInfosRepository {
    getGroupeInfos(code: string, legislature: number): Promise<any>; //todo GroupeInfosEntity
}