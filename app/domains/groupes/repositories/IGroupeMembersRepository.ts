
export interface IGroupeMembersRepository {
    getGroupeMembers(code: string, legislature: number): Promise<any>; //todo GroupeMembersEntity
}