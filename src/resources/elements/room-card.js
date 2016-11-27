import { Router } from 'aurelia-router';
import { RoomDeleted } from '../messages';
import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable, inject } from 'aurelia-framework';
import { API } from '../../api';

@inject(Router, API, EventAggregator)
export class RoomCard {
    @bindable room;

    constructor(router, api, ea) {
        this.router = router;
        this.api = api;
        this.ea = ea;
    }

    connect() {
        this.router.navigate(`room/${this.room.id}`);
    }

    delete() {
        this.api.deleteRoom(this.room.id).then(() => {
            this.ea.publish(new RoomDeleted(this.room));
        });
    }

}