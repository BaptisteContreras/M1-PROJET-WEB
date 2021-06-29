const db = require('../storage/DataBase')();
const notificationDispatcher = require('../notification/NotificationDispatcher')();
const EventsLib = require('events');
var emitter = require('../event/Emitter')()
const GameNotification = require('../notification/GameNotification')
const events = require('../event/Events');

class GameNotificationManager {

    constructor(db, notificationDispatcher,emitter) {
        if (!!GameNotificationManager.instance) {
            return GameNotificationManager.instance;
        }
        this._notificationDispatcher = notificationDispatcher;
        this._db = db;
        this._emitter = emitter
        this._ignoredEvents = [
            'capturetarget',
            'gamecancontinue',
        ]
        this.registerListener();


        GameNotificationManager.instance = this;

        return this;
    }
    registerListener() {
        for (let [key, value] of Object.entries(events)) {
            this._emitter.getEmitterInstance().addListener(value, (e) => {this._eventDispatcher(e)});
            console.log("[GameNotificationManager] register listener for " + value)
        }
    }
    _eventDispatcher(e) {
        let type = e.meta.type;
        let players = e.meta.players;
        let context = e.meta.params ? e.meta.params : {}
        if (this._ignoredEvents.includes(type)) return false
        console.log("game notification receive " + type +" event")
        players.forEach((cp) => {
            this._notificationDispatcher.dispatch(new GameNotification(cp, type));
        });

    }
}


module.exports = function () {
    return new GameNotificationManager(db, notificationDispatcher,emitter);
};
