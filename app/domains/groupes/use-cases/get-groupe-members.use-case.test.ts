import { getGroupeMembersUseCase } from "@/app/domains/groupes/use-cases/get-groupe-members.use-case";
import { IGroupeMembersRepository } from "@/app/domains/groupes/repositories/IGroupeMembersRepository";
import { GroupeMembersEntity } from "@/app/domains/groupes/entities/groupe-members.entity";

describe("getGroupeMembersUseCase", () => {
    it("returns ok(dtos) mapping every member", async () => {
        const entities: GroupeMembersEntity[] = [
            { first_name: "Jean", last_name: "Dupont", since: new Date("2024-07-08"), circonscription: "1ère (Paris)", age: 52 },
        ];
        const repository: IGroupeMembersRepository = {
            getGroupeMembers: jest.fn().mockResolvedValue(entities),
        };

        const result = await getGroupeMembersUseCase(repository, "REN", 17);

        expect(repository.getGroupeMembers).toHaveBeenCalledWith("REN", 17);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual([
            { deputyFirstName: "Jean", deputyLastName: "Dupont", since: new Date("2024-07-08"), circonscription: "1ère (Paris)", age: 52 },
        ]);
    });

    it("returns err('ERROR') when the repository resolves null", async () => {
        const repository: IGroupeMembersRepository = {
            getGroupeMembers: jest.fn().mockResolvedValue(null as unknown as GroupeMembersEntity[]),
        };

        const result = await getGroupeMembersUseCase(repository, "UNKNOWN", 17);

        expect(result).toEqual({ success: false, error: "ERROR" });
    });

    it("returns ok([]) for a group with no members", async () => {
        const repository: IGroupeMembersRepository = {
            getGroupeMembers: jest.fn().mockResolvedValue([]),
        };

        const result = await getGroupeMembersUseCase(repository, "REN", 17);

        expect(result).toEqual({ success: true, data: [] });
    });

    it("forwards a past legislature (16) to the repository and maps its members", async () => {
        const entities: GroupeMembersEntity[] = [
            { first_name: "Jean", last_name: "Dupont", since: new Date("2022-06-22"), circonscription: "1ère (Paris)", age: 52 },
        ];
        const repository: IGroupeMembersRepository = {
            getGroupeMembers: jest.fn().mockResolvedValue(entities),
        };

        const result = await getGroupeMembersUseCase(repository, "REN", 16);

        expect(repository.getGroupeMembers).toHaveBeenCalledWith("REN", 16);
        if (!result.success) throw new Error("expected success");
        expect(result.data).toEqual([
            { deputyFirstName: "Jean", deputyLastName: "Dupont", since: new Date("2022-06-22"), circonscription: "1ère (Paris)", age: 52 },
        ]);
    });

    // Régression : la 16e législature (dissoute juillet 2024) ne doit pas remonter
    // vide juste parce qu'elle n'est plus "en cours".
    it("returns ok([]) for a past legislature when the repository finds nothing", async () => {
        const repository: IGroupeMembersRepository = {
            getGroupeMembers: jest.fn().mockResolvedValue([]),
        };

        const result = await getGroupeMembersUseCase(repository, "REN", 16);

        expect(repository.getGroupeMembers).toHaveBeenCalledWith("REN", 16);
        expect(result).toEqual({ success: true, data: [] });
    });
});
