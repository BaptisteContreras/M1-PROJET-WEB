
class TrophyUnlocker {


    constructor(db , events) {
        this._db = db;
        this._events = events;
    }

    getEvents(){
        return this._events;
    }

    unlock(player, context = {}){}


}

module.exports = TrophyUnlocker
