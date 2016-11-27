import { RoomsStore } from './data/stores/rooms';
import { inject } from 'aurelia-framework';


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4() + s4();
}

@inject(RoomsStore)
export class API {
    isRequesting = false;

    constructor(roomsStore) {
        this.roomStore = roomsStore;
    }

    getRooms() {
        return this.roomStore.read();
    }

    getRoom(id) {
        return this.roomStore.getById(id);
    }

    createRoom({name, description}) {
        this.isRequesting = true;
        return this.roomStore.create({
            id: guid(),
            name,
            description,
            createdAt: Date.now(),
            members: []
        }).then(res => {
            this.isRequesting = false;
            return Promise.resolve(res);
        }).catch(e => {
            this.isRequesting = false;
            console.error(e);
        });
    }

    deleteRoom(id) {
        return this.roomStore.delete(id);
    }

}