import { db } from '../db';

export default class BaseStore {
    constructor(storeName) {
        this.storseName = storeName;
        this.table = db[storeName];
    }

    getById(id) {
        return this.table.where("id").equals(id)
            .toArray()
            .then(res => Promise.resolve(res[0]));
    }

    create(item) {
        return this.table.add(item).then(id => {
            return this.table.where("id").equals(id)
                .toArray()
                .then(res => Promise.resolve(res[0]));
        });
    }

    bulkCreate(items) {
        return this.table.bulkAdd(items);
    }

    read(predicate) {

        return predicate ? predicate(this.table) : this.table.toArray();
    }

    update(id, item) {
        return this.table.update(id, item);
    }

    bulkUpdate(items) {
        return this.table.bulkPut(items);
    }

    delete(id) {
        return this.table.delete(id);
    }
}