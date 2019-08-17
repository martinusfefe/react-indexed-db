import React, { ReactNode, useState } from 'react';
import { ReactIndexedDB } from './react-indexed-db';
import { DBOperations, openDatabase, Key } from './indexed-db';

interface IndexedDBProps {
  name: string;
  version: number;
  children: ReactNode;
  objectStoresMeta: ObjectStoreMeta[];
}

interface ObjectStoreMeta {
  store: string;
  storeConfig: { keyPath: string; autoIncrement: boolean; [key: string]: any };
  storeSchema: ObjectStoreSchema[];
}

interface ObjectStoreSchema {
  name: string;
  keypath: string;
  options: { unique: boolean; [key: string]: any };
}

const IndexedDBContext = React.createContext<{ db: any; name: string; version: number }>({
  db: null,
  name: null,
  version: null
});
const IndexedDBProvider = IndexedDBContext.Provider;
const IndexedDBCosumer = IndexedDBContext.Consumer;
export function IndexedDB({ name, version, children, objectStoresMeta }: IndexedDBProps) {
  objectStoresMeta.forEach(async (schema: ObjectStoreMeta) => {
    const db = await openDatabase(name, version, (event: any) => {
      let db: IDBDatabase = event.currentTarget.result;
      let objectStore = db.createObjectStore(schema.store, schema.storeConfig);
      schema.storeSchema.forEach((schema: ObjectStoreSchema) => {
        objectStore.createIndex(schema.name, schema.keypath, schema.options);
      });
    });
  });
  return <IndexedDBProvider value={{ db: null, name, version }}>{children}</IndexedDBProvider>;
}

interface AccessDBProps {
  children: ({
    db,
    add
  }: {
    db: IDBDatabase;
    add: <T = any>(value: T, key?: any) => Promise<number>;
    getByID: <T = any>(id: number | string) => Promise<T>;
    getAll: <T = any>() => Promise<T[]>;
    getAllSync: <T = any>(args: any) => void;
    update: <T = any>(key: any, value: T) => Promise<any>;
    deleteRecord: (key: Key) => Promise<any>;
    openCursor: (cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) => Promise<void>;
    getByIndex: (indexName: string, key: any) => Promise<any>;
  }) => {};
  objectStore: string;
}

export function AccessDB({ children, objectStore }: AccessDBProps) {
  return (
    <IndexedDBCosumer>
      {value => {
        const { db, name, version } = value;
        // openDatabase(name, version);
        return children({ db, ...DBOperations(name, version, objectStore) });
      }}
    </IndexedDBCosumer>
  );
}
