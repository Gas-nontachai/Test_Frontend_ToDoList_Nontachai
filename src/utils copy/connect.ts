export const dbName = 'TaskDB';
export const storeName = 'tasks';

let db: IDBDatabase | null = null;

export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onerror = () => {
            reject(new Error('Failed to open IndexedDB'));
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBRequest).result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'task_id' });
            }
        };
    });
};

export const getStore = (): IDBObjectStore => {
    if (!db) throw new Error('Database not opened');
    return db.transaction(storeName, 'readwrite').objectStore(storeName);
};
export const getDBStore = async (): Promise<IDBObjectStore> => {
    await openDB();
    return getStore();
};