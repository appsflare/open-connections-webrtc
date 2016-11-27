define('api',['exports', './data/stores/rooms', 'aurelia-framework'], function (exports, _rooms, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.API = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + s4() + s4();
    }

    var API = exports.API = (_dec = (0, _aureliaFramework.inject)(_rooms.RoomsStore), _dec(_class = function () {
        function API(roomsStore) {
            _classCallCheck(this, API);

            this.isRequesting = false;

            this.roomStore = roomsStore;
        }

        API.prototype.getRooms = function getRooms() {
            return this.roomStore.read();
        };

        API.prototype.getRoom = function getRoom(id) {
            return this.roomStore.getById(id);
        };

        API.prototype.createRoom = function createRoom(_ref) {
            var _this = this;

            var name = _ref.name,
                description = _ref.description;

            this.isRequesting = true;
            return this.roomStore.create({
                id: guid(),
                name: name,
                description: description,
                createdAt: Date.now(),
                members: []
            }).then(function (res) {
                _this.isRequesting = false;
                return Promise.resolve(res);
            }).catch(function (e) {
                _this.isRequesting = false;
                console.error(e);
            });
        };

        API.prototype.deleteRoom = function deleteRoom(id) {
            return this.roomStore.delete(id);
        };

        return API;
    }()) || _class);
});
define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Open Connections';
      config.map([{ route: '', moduleId: 'rooms', title: 'Rooms' }, { route: 'room/:id', moduleId: 'room', name: 'room' }]);

      this.router = router;
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment', './data/db'], function (exports, _environment, _db) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  var _db2 = _interopRequireDefault(_db);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    Promise.all([(0, _db.initDB)(), aurelia.start()]).then(function () {
      return aurelia.setRoot();
    });
  }
});
define('room',['exports', 'aurelia-framework', './api'], function (exports, _aureliaFramework, _api) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Room = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Room = exports.Room = (_dec = (0, _aureliaFramework.inject)(_api.API), _dec(_class = function () {
        function Room(api) {
            _classCallCheck(this, Room);

            this.room = null;


            this.api = api;
        }

        Room.prototype.canActivate = function canActivate(_ref) {
            var _this = this;

            var id = _ref.id;

            return this.api.getRoom(id).then(function (room) {
                _this.room = room || { id: id };
                return Promise.resolve(true);
            });
        };

        return Room;
    }()) || _class);
});
define('rooms',['exports', 'aurelia-framework', './api'], function (exports, _aureliaFramework, _api) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Rooms = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var Rooms = exports.Rooms = (_dec = (0, _aureliaFramework.inject)(_api.API), _dec(_class = function () {
        function Rooms(api) {
            _classCallCheck(this, Rooms);

            this.api = api;

            this.title = 'Rooms';

            this.name = '';
            this.description = '';
        }

        Rooms.prototype.create = function create() {

            this.api.createRoom({
                name: this.name,
                description: this.description
            });
        };

        return Rooms;
    }()) || _class);
});
define('data/db',['exports', 'dexie', './stores/rooms'], function (exports, _dexie, _rooms) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.db = undefined;
    exports.initDB = initDB;

    var _dexie2 = _interopRequireDefault(_dexie);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var db = exports.db = new _dexie2.default('open-connections');

    var dbv1 = db.version(1);

    var _initResult = void 0;
    function initDB() {
        if (_initResult) {
            return _initResult;
        }

        dbv1.stores(Object.assign({}, _rooms.RoomsStore.getSchema()));

        return _initResult = db.open();
    }
});
define('resources/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources(['./elements/loading-indicator']);
  }
});
define('resources/messages',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var RoomDeleted = exports.RoomDeleted = function RoomDeleted(room) {
        _classCallCheck(this, RoomDeleted);

        this.room = room;
    };
});
define('data/stores/base-store',["exports", "../db"], function (exports, _db) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var BaseStore = function () {
        function BaseStore(storeName) {
            _classCallCheck(this, BaseStore);

            this.storseName = storeName;
            this.table = _db.db[storeName];
        }

        BaseStore.prototype.getById = function getById(id) {
            return this.table.where("id").equals(id).toArray().then(function (res) {
                return Promise.resolve(res[0]);
            });
        };

        BaseStore.prototype.create = function create(item) {
            var _this = this;

            return this.table.add(item).then(function (id) {
                return _this.table.where("id").equals(id).toArray().then(function (res) {
                    return Promise.resolve(res[0]);
                });
            });
        };

        BaseStore.prototype.bulkCreate = function bulkCreate(items) {
            return this.table.bulkAdd(items);
        };

        BaseStore.prototype.read = function read(predicate) {

            return predicate ? predicate(this.table) : this.table.toArray();
        };

        BaseStore.prototype.update = function update(id, item) {
            return this.table.update(id, item);
        };

        BaseStore.prototype.bulkUpdate = function bulkUpdate(items) {
            return this.table.bulkPut(items);
        };

        BaseStore.prototype.delete = function _delete(id) {
            return this.table.delete(id);
        };

        return BaseStore;
    }();

    exports.default = BaseStore;
});
define('data/stores/rooms',['exports', './base-store', 'aurelia-framework'], function (exports, _baseStore, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RoomsStore = undefined;

    var _baseStore2 = _interopRequireDefault(_baseStore);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var RoomsStore = exports.RoomsStore = function (_BaseStore) {
        _inherits(RoomsStore, _BaseStore);

        function RoomsStore() {
            _classCallCheck(this, RoomsStore);

            return _possibleConstructorReturn(this, _BaseStore.call(this, "rooms"));
        }

        RoomsStore.getSchema = function getSchema() {
            return { rooms: 'id,name,description,members,createdAt' };
        };

        return RoomsStore;
    }(_baseStore2.default);
});
define('resources/elements/loading-indicator',['exports', 'nprogress', 'aurelia-framework'], function (exports, _nprogress, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LoadingIndicator = undefined;

  var nprogress = _interopRequireWildcard(_nprogress);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var LoadingIndicator = exports.LoadingIndicator = (0, _aureliaFramework.decorators)((0, _aureliaFramework.noView)(['nprogress/nprogress.css']), (0, _aureliaFramework.bindable)({ name: 'loading', defaultValue: false })).on(function () {
    function _class() {
      _classCallCheck(this, _class);
    }

    _class.prototype.loadingChanged = function loadingChanged(newValue) {
      if (newValue) {
        nprogress.start();
      } else {
        nprogress.done();
      }
    };

    return _class;
  }());
});
define('resources/elements/room-card',['exports', 'aurelia-router', '../messages', 'aurelia-event-aggregator', 'aurelia-framework', '../../api'], function (exports, _aureliaRouter, _messages, _aureliaEventAggregator, _aureliaFramework, _api) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RoomCard = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor;

    var RoomCard = exports.RoomCard = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _api.API, _aureliaEventAggregator.EventAggregator), _dec(_class = (_class2 = function () {
        function RoomCard(router, api, ea) {
            _classCallCheck(this, RoomCard);

            _initDefineProp(this, 'room', _descriptor, this);

            this.router = router;
            this.api = api;
            this.ea = ea;
        }

        RoomCard.prototype.connect = function connect() {
            this.router.navigate('room/' + this.room.id);
        };

        RoomCard.prototype.delete = function _delete() {
            var _this = this;

            this.api.deleteRoom(this.room.id).then(function () {
                _this.ea.publish(new _messages.RoomDeleted(_this.room));
            });
        };

        return RoomCard;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'room', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class2)) || _class);
});
define('resources/elements/room-view',['exports', 'aurelia-router', '../messages', 'aurelia-event-aggregator', 'aurelia-framework', '../../api', 'SimpleWebRTC'], function (exports, _aureliaRouter, _messages, _aureliaEventAggregator, _aureliaFramework, _api, _SimpleWebRTC) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RoomView = undefined;

    var _SimpleWebRTC2 = _interopRequireDefault(_SimpleWebRTC);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _class, _desc, _value, _class2, _descriptor;

    var RoomView = exports.RoomView = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _api.API, _aureliaEventAggregator.EventAggregator), _dec(_class = (_class2 = function () {
        function RoomView(router, api, ea) {
            _classCallCheck(this, RoomView);

            _initDefineProp(this, 'room', _descriptor, this);

            this.router = router;
            this.api = api;
            this.ea = ea;
            this.status = '';
        }

        RoomView.prototype.attached = function attached() {
            var _this = this;

            this.rtc = new _SimpleWebRTC2.default({
                localVideoEl: 'localVideo'
            });

            this.rtc = new _SimpleWebRTC2.default({
                localVideoEl: 'localVideo',

                autoRequestMedia: true,
                url: 'https://connections.appsflare.com/'
            });

            if (this.room.name) {
                this.rtc.createRoom(this.room.id, function (err, room) {
                    err && console.error(err);
                });
            } else {
                this.rtc.connection.on('message', function (_ref) {
                    var type = _ref.type,
                        payload = _ref.payload;

                    if (type === 'roomDetails') {
                        _this.room.name = payload.name;
                        _this.room.description = payload.description;
                    }
                });

                this.rtc.joinRoom(this.room.id, function (err, room) {
                    err && console.error(err);
                });
            }

            this.rtc.on('videoAdded', function (video, peer) {

                _this.rtc.sendToAll("roomDetails", { name: _this.room.name, description: _this.room.description });

                console.log('video added', peer);
                var remotes = document.getElementById('remotes');
                if (remotes) {
                    video.oncontextmenu = function () {
                        return false;
                    };
                    video.className = "embed-responsive-item";
                    video.controls = true;
                    var $container = $('<div class="col-md-6" id="' + _this.rtc.getDomId(peer) + '"><div class="panel panel-default">\n            <div class="panel-body"><div class="embed-responsive embed-responsive-16by9">\n                \n            </div></div>\n            <div class="panel-footer"></div>\n        </div></div>');
                    $container.find('.embed-responsive').append(video);

                    $container.appendTo(remotes);
                }
            });

            this.rtc.on('videoRemoved', function (video, peer) {
                console.log('video removed ', peer);
                $('#' + _this.rtc.getDomId(peer)).remove();
            });
        };

        RoomView.prototype.delete = function _delete() {
            var _this2 = this;

            this.api.deleteRoom(this.room.id).then(function () {
                _this2.ea.publish(new _messages.RoomDeleted(_this2.room));
            });
        };

        return RoomView;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'room', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class2)) || _class);
});
define('resources/elements/room',[], function () {});
define('resources/elements/rooms-list',['exports', '../../api', 'aurelia-framework', 'aurelia-event-aggregator', '../messages'], function (exports, _api, _aureliaFramework, _aureliaEventAggregator, _messages) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RoomsList = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var RoomsList = exports.RoomsList = (_dec = (0, _aureliaFramework.inject)(_api.API, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
        function RoomsList(api, ea) {
            var _this = this;

            _classCallCheck(this, RoomsList);

            this.room = { name: '', description: '' };
            this.rooms = [];

            this.api = api;
            this.ea = ea;

            this.ea.subscribe(_messages.RoomDeleted, function (msg) {
                if (!msg || !msg.room) {
                    return;
                }

                _this.rooms.splice(_this.rooms.indexOf(msg.room), 1);
            });
        }

        RoomsList.prototype.resetCreateNewRoom = function resetCreateNewRoom() {
            this.room.name = '';
            this.room.description = '';
        };

        RoomsList.prototype.createNewRoom = function createNewRoom() {
            var _this2 = this;

            this.api.createRoom(this.room).then(function (room) {
                return _this2.rooms.push(room);
            });
        };

        RoomsList.prototype.attached = function attached() {
            var _this3 = this;

            this.api.getRooms().then(function (rooms) {
                return _this3.rooms = rooms;
            });
        };

        return RoomsList;
    }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./styles/app.css\"></require> \n\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-video-camera\"></i>\n        <span>${router.title}</span>\n      </a>\n    </div>\n  </nav>\n\n  <loading-indicator loading.bind=\"router.isNavigating || api.isRequesting\"></loading-indicator>\n\n  <div class=\"container\">\n    <div class=\"row\">      \n      <router-view class=\"col-md-8\"></router-view>\n    </div>\n  </div>\n\n</template>\n"; });
define('text!room.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./resources/elements/room-view\"></require>\n    <div class=\"row\">\n        <div class=\"container\">\n            <div class=\"page-header\">\n                <h1>${room.name} <small>${room.description}</small></h1>\n            </div>\n            <div class=\"row\">\n                <room-view room.bind=\"room\"></room-view>\n            </div>\n        </div>\n\n    </div>\n</template>"; });
define('text!styles/app.css', ['module'], function(module) { module.exports = "body {\n  padding-top: 70px; }\n"; });
define('text!rooms.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./resources/elements/rooms-list\"></require>\n    <div class=\"row\">\n        <div class=\"container\">\n            <h1>${title}</h1>\n        </div>\n        <rooms-list></rooms-list>\n    </div>\n</template>"; });
define('text!resources/elements/room-card.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"thumbnail\">\n        <div class=\"caption\">\n            <h3>${room.name}</h3>\n            <p>${room.description}</p>\n            <p>\n                <input type=\"button\" class=\"btn btn-primary\" role=\"button\" click.delegate=\"connect()\" value=\"Connect\"/>\n                <input type=\"button\" class=\"btn btn-default\" role=\"button\" click.delegate=\"delete()\" value=\"Delete\"/>\n            </p>\n        </div>\n    </div>\n</template>"; });
define('text!resources/elements/room-view.html', ['module'], function(module) { module.exports = "<template bindable=\"room\">\n\n    <div class=\"row\" id=\"remotes\">\n        <div class=\"col-md-6\">\n            <div class=\"panel panel-default\">\n                <div class=\"panel-body\">\n                    <div class=\"embed-responsive embed-responsive-16by9\">\n                        <video class=\"embed-responsive-item\" id=\"localVideo\" />\n                    </div>\n                </div>\n                <div class=\"panel-footer\"></div>\n            </div>\n        </div>\n    </div>\n</template>"; });
define('text!resources/elements/rooms-list.html', ['module'], function(module) { module.exports = "<template bindable=\"rooms\">\n    <require from=\"./room-card\"></require>\n    <div class=\"row\">\n        <div class=\" thumbnail col-md-12\">\n            <form class=\"form-inline\" submit.delegate=\"createNewRoom()\">\n                <div class=\"form-group\">\n                    <div class=\"col-sm-10\">\n                        <input id=\"inputRoomName\" type=\"text\" class=\"form-control\" placeholder=\"Room Name\" name=\"name\" value.two-way=\"room.name\"\n                        />\n                    </div>\n                </div>\n                <div class=\"form-group\">\n                    <div class=\"col-sm-10\">\n                        <textarea id=\"textDescription\" class=\"form-control\" placeholder=\"What is this room for?\" value.two-way=\"room.description\"></textarea>\n                    </div>\n                </div>\n\n                <button type=\"submit\" class=\"btn btn-primary\">Create</button>\n                <a href=\"#\" class=\"btn btn-default\" role=\"button\" click.delegate=\"resetCreateNewRoom()\">Reset</a>\n\n            </form>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"alert alert-warning\" if.bind=\"!rooms.length\" role=\"alert\">You are lonely out in this realm. Create a room to get some company!!</div>\n        <div class=\"col-sm-6 col-md-4\" repeat.for=\"room of rooms\">\n            <room-card room.bind=\"room\"> </room-card>\n        </div>\n    </div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map