const db = require('../../storage/DataBase')()
const events = require('../../event/Events')
const TrophyUnlocker = require('./TrophyUnlocker')

class PlayAGameUnlocker extends TrophyUnlocker{

    constructor(db, events) {
        super(db, events);

        if (!!PlayAGameUnlocker.instance) {
            return PlayAGameUnlocker.instance;
        }

        PlayAGameUnlocker.instance = this;

        return this;
    }

    unlock(player, context = {}){
        return true
    }
}


module.exports = function () {
    return new PlayAGameUnlocker(db, [events.GAME_END]);
};
