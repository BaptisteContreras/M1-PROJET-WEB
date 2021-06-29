const db = require('../../storage/DataBase')()
const events = require('../../event/Events')
const TrophyUnlocker = require('./TrophyUnlocker')


class WinTwoGameUnlocker extends TrophyUnlocker{

    constructor(db, events) {
        super(db, events);

        if (!!WinTwoGameUnlocker.instance) {
            return WinTwoGameUnlocker.instance;
        }


        this._winCounts = {};
        this._win = 2;
        WinTwoGameUnlocker.instance = this;

        return this;
    }

    unlock(player, context = {}){
        if (player === context.winner){
            if (this._winCounts[player]){
                this._winCounts[player]++;
            }else{
                this._winCounts[player] = 1;
            }
        }
        return this._winCounts[player] >= this._win;
    }
}


module.exports = function () {
    return new WinTwoGameUnlocker(db, [events.GAME_END]);
};
