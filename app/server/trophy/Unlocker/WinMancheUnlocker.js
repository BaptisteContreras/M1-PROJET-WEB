const db = require('../../storage/DataBase')()
const events = require('../../event/Events')
const TrophyUnlocker = require('./TrophyUnlocker')


class WinMancheUnlocker extends TrophyUnlocker{

    constructor(db, events) {
        super(db, events);

        if (!!WinMancheUnlocker.instance) {
            return WinMancheUnlocker.instance;
        }

        WinMancheUnlocker.instance = this;

        return this;
    }

    unlock(player, context = {}){
        return player === context.winner.id
    }
}


module.exports = function () {
    return new WinMancheUnlocker(db, [events.MANCHE_END]);
};
