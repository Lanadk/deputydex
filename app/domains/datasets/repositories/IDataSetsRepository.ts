export type IDataSetsRepository = {
    getLastUpdate(): Promise<Date | null>;
}