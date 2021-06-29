const db = require('../storage/DataBase')();
const notificationDispatcher = require('../notification/NotificationDispatcher')();
const WinTwoGameUnlocker = require('./Unlocker/WinTwoGameUnlocker')();
const WinGameUnlocker = require('./Unlocker/WinGameUnlocker')();
const WinMancheUnlocker = require('./Unlocker/WinMancheUnlocker')();
const WinThreeMancheUnlocker = require('./Unlocker/WinThreeMancheUnlocker')();
const CaptureFiveTargetsUnlocker = require('./Unlocker/CaptureFiveTargetsUnlocker')();
const PlayAGameUnlocker = require('./Unlocker/PlayAGameUnlocker')();
const Trophy = require('./Trophy');
const EventsLib = require('events');
var emitter = require('../event/Emitter')()
const TrophyNotification = require('../notification/TrophyNotification')
const events = require('../event/Events');


class TrophyManager {

    constructor(db, notificationDispatcher,emitter) {
        if (!!TrophyManager.instance) {
            return TrophyManager.instance;
        }
        this._notificationDispatcher = notificationDispatcher;
        this._list = [];
        this._db = db;
        this._emitter = emitter
        this.registerTrophy();
        this.registerListener();


        TrophyManager.instance = this;

        return this;
    }

    registerListener() {
        for (let [key, value] of Object.entries(events)) {
            this._emitter.getEmitterInstance().addListener(value, (e) => {this._eventDispatcher(e)});
            console.log("[TrophyNotificationManager] register listener for " + value)
        }
    }

    registerTrophy() {
        this._addTrophy({
            "id": "1",
            "name": "Trophé #1",
            "description": "Gagner une partie",
            "difficulty": "Moyen"
        }, WinGameUnlocker);
        this._addTrophy({
            "id": "2",
            "name": "Trophé #2",
            "description": "Gagner 2 parties",
            "difficulty": "Difficile"
        }, WinTwoGameUnlocker);
        this._addTrophy({
            "id": "3",
            "name": "Trophé #3",
            "description": "Jouer une partie",
            "difficulty": "Facile"
        }, PlayAGameUnlocker);
        this._addTrophy({
            "id": "4",
            "name": "Trophé #4",
            "description": "Gagner une manche",
            "difficulty": "Facile"
        }, WinMancheUnlocker);
        this._addTrophy({
            "id": "5",
            "name": "Trophé #5",
            "description": "Gagner trois manches",
            "difficulty": "Moyen"
        }, WinThreeMancheUnlocker);
        this._addTrophy({
            "id": "6",
            "name": "Trophé #6",
            "description": "Capturer 5 cibles",
            "difficulty": "Difficile"
        }, CaptureFiveTargetsUnlocker);

        for (let i in this._list) {
            let trophy = this._list[i];
            db.addElement('trophies', trophy.toJson());
        }
    }

    _addTrophy(obj, unlocker) {
        this._list.push(new Trophy(
            obj.id,
            obj.name,
            obj.description,
            obj.difficulty,
            unlocker
        ));
    }



    _getTrophyListForEvent(event) {
        return this._list.filter((t) => t.listenOn().includes(event));
    }
    _eventDispatcher(e) {
        let type = e.meta.type;
        let players = e.meta.players;
        let context = e.meta.params ? e.meta.params : {}
        console.log(e)
        let concerned = this._getTrophyListForEvent(type);
        concerned.forEach((el) => {
            players.forEach((cp) => {
                this._tryUnlock(el, cp, context);
            });
        });

    }

    _tryUnlock(trophy, player, context) {
        let noDoublon = this._noDoublon(trophy,player)
        if (noDoublon){
            let done = trophy.canUnlock(player, context);
            if (done) {
                this._notificationDispatcher.dispatch(new TrophyNotification(player, trophy));
                this._dbUnlock(trophy,player)
                console.log("unlocked")
                console.log((new TrophyNotification(player, trophy)).send())
            }
        }
    }

    _dbUnlock(trophy, player){
        let tmpPlayer = this._db.getElement("resources", player)
        tmpPlayer.trophy.filter((t) => t.id === trophy.getId())[0]["done"] = true;
    }
    _noDoublon(trophy, player){
        let tmpPlayer = this._db.getElement("resources", player)
        return !tmpPlayer.trophy.filter((t) => t.id === trophy.getId())[0]["done"]
    }


}


module.exports = function () {
    return new TrophyManager(db, notificationDispatcher,emitter);
};
