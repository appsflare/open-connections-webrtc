import Dexie from 'dexie';

import { RoomsStore } from './stores/rooms';  


export const db = new Dexie('open-connections');

let dbv1 = db.version(1);


let _initResult;
export function initDB() {
    if (_initResult) {
        return _initResult;
    }

    dbv1.stores(Object.assign({}, RoomsStore.getSchema()));

    return _initResult = db.open();
}