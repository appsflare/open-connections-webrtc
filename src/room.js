import { inject } from 'aurelia-framework';
import { API } from './api';

@inject(API)
export class Room {
    room = null;

    constructor(api) {

        this.api = api;
    }

    canActivate({id}) {
        return this.api.getRoom(id).then(room => {
            this.room = room || { id };
            return Promise.resolve(true);
        });
    }
}