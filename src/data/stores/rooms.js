import BaseStore from './base-store';
import {inject} from 'aurelia-framework';

export class RoomsStore extends BaseStore {
    constructor() {
        super("rooms");
    }

    static getSchema() {
        return { rooms: 'id,name,description,members,createdAt' };
    }

}