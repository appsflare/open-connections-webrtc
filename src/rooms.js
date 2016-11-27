import { inject } from 'aurelia-framework';
import { API } from './api';

@inject(API)
export class Rooms {
    constructor(api) {

        this.api = api;

        this.title = 'Rooms';

        this.name = '';
        this.description = '';
    }

    create() {

        this.api.createRoom({
            name: this.name,
            description: this.description
        });

    }
}