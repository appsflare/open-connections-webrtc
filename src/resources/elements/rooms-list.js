import { API } from '../../api';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { RoomDeleted } from '../messages';

@inject(API, EventAggregator)
export class RoomsList {
    room = { name: '', description: '' };
    rooms = [];

    constructor(api, ea) {
        this.api = api;
        this.ea = ea;

        this.ea.subscribe(RoomDeleted, msg => {
            if (!msg || !msg.room)
            { return; }

            this.rooms.splice(this.rooms.indexOf(msg.room), 1);
        });
    }

    resetCreateNewRoom() {
        this.room.name = '';
        this.room.description = '';
    }

    createNewRoom() {
        this.api.createRoom(this.room)
            .then(room => this.rooms.push(room));
    }

    attached() {
        this.api.getRooms().then(rooms => this.rooms = rooms);
    }

}