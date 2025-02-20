import { ObjectStoreMeta } from "./indexed-hooks";
export type Key = string | number | Date | ArrayBufferView | ArrayBuffer | IDBKeyRange;
export interface IndexDetails {
    indexName: string;
    order: string;
}
export declare function openDatabase(dbName: string, version: number, upgradeCallback?: (e: Event, db: IDBDatabase) => void): Promise<IDBDatabase>;
export declare function CreateObjectStore(dbName: string, version: number, storeSchemas: ObjectStoreMeta[]): void;
export declare function DBOperations(dbName: string, version: number, currentStore: string): {
    add: <T>(value: T, key?: any) => Promise<number>;
    getByID: <T_1>(id: string | number) => Promise<T_1>;
    getAll: <T_2>() => Promise<T_2[]>;
    update: <T_3>(value: T_3, key?: any) => Promise<any>;
    deleteRecord: (key: Key) => Promise<any>;
    clear: () => Promise<void>;
    openCursor: (cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) => Promise<void>;
    getByIndex: (indexName: string, key: any) => Promise<any>;
};
export declare enum DBMode {
    readonly = "readonly",
    readwrite = "readwrite"
}
