export type IEntity<T extends {} = {}> = { id: number | string } & T;
