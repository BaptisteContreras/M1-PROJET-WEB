const db = require('../../storage/DataBase')()
const events = require('../../event/Events')
const TrophyUnlocker = require('./TrophyUnlocker')


class WinThreeMancheUnlocker extends TrophyUnlocker{

    constructor(db, events) {
        super(db, events);

        if (!!WinThreeMancheUnlocker.instance) {
            return WinThreeMancheUnlocker.instance;
        }

        this._winCounts = {};
        this._win = 3;

        WinThreeMancheUnlocker.instance = this;



        return this;
    }

    unlock(player, context = {}){
        if (player === context.winner.id){
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
    return new WinThreeMancheUnlocker(db, [events.MANCHE_END]);
};
