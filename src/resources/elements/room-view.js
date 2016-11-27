import { Router } from 'aurelia-router';
import { RoomDeleted } from '../messages';
import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable, inject } from 'aurelia-framework';
import { API } from '../../api';

import SimpleWebRTC from 'SimpleWebRTC';

@inject(Router, API, EventAggregator)
export class RoomView {
    @bindable room;


    constructor(router, api, ea) {
        this.router = router;
        this.api = api;
        this.ea = ea;
        this.status = '';
    }

    attached() {
        this.rtc = new SimpleWebRTC({
            localVideoEl: 'localVideo'
        });

        this.rtc = new SimpleWebRTC({
            // the id/element dom element that will hold "our" video 
            localVideoEl: 'localVideo',

            // immediately ask for camera access 
            autoRequestMedia: true,
            url: 'https://connections.appsflare.com/'
        });

        if (this.room.name) {
            this.rtc.createRoom(this.room.id, (err, room) => {
                err && console.error(err);
            });

        }
        else {
            this.rtc.connection.on('message', ({type, payload}) => {
                if (type === 'roomDetails') {
                    this.room.name = payload.name;
                    this.room.description = payload.description;
                }
            });

            this.rtc.joinRoom(this.room.id, (err, room) => {
                err && console.error(err);
            });


        }


        this.rtc.on('videoAdded', (video, peer) => {

            this.rtc.sendToAll("roomDetails", { name: this.room.name, description: this.room.description });

            console.log('video added', peer);
            var remotes = document.getElementById('remotes');
            if (remotes) {
                // suppress contextmenu
                video.oncontextmenu = function () { return false; };
                video.className = "embed-responsive-item";

                var $container = $(`<div class="col-md-6"><div class="panel panel-default" id="${this.rtc.getDomId(peer)}">
            <div class="panel-body"><div class="embed-responsive embed-responsive-16by9">
                
            </div></div>
            <div class="panel-footer"></div>
        </div></div>`);
                $container.find('.embed-responsive').append(video);

                $container.appendTo(remotes);


            }
        });

        // a peer video was removed
        this.rtc.on('videoRemoved', (video, peer) => {
            console.log('video removed ', peer);
            $(`#${this.rtc.getDomId(peer)}`).parent().remove();
        });
    }

    delete() {
        this.api.deleteRoom(this.room.id).then(() => {
            this.ea.publish(new RoomDeleted(this.room));
        });
    }

}