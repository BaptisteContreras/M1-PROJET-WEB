const db = require('../../storage/DataBase')()
const events = require('../../event/Events')
const TrophyUnlocker = require('./TrophyUnlocker')


class WinGameUnlocker extends TrophyUnlocker{

    constructor(db, events) {
        super(db, events);

        if (!!WinGameUnlocker.instance) {
            return WinGameUnlocker.instance;
        }

        WinGameUnlocker.instance = this;

        return this;
    }

    unlock(player, context = {}){
        return player === context.winner
    }
}


module.exports = function () {
    return new WinGameUnlocker(db, [events.GAME_END]);
};
