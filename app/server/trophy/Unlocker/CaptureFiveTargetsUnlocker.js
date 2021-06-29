const db = require('../../storage/DataBase')()
const events = require('../../event/Events')
const TrophyUnlocker = require('./TrophyUnlocker')


class CaptureFiveTargetsUnlocker extends TrophyUnlocker{

    constructor(db, events) {
        super(db, events);

        if (!!CaptureFiveTargetsUnlocker.instance) {
            return CaptureFiveTargetsUnlocker.instance;
        }

        this._winCounts = {};
        this._win = 5;

        CaptureFiveTargetsUnlocker.instance = this;



        return this;
    }

    unlock(player, context = {}){
        if (this._winCounts[player]){
            this._winCounts[player]++;
        }else{
            this._winCounts[player] = 1;
        }
        return this._winCounts[player] >= this._win;
    }
}


module.exports = function () {
    return new CaptureFiveTargetsUnlocker(db, [events.CAPTURE_TARGET]);
};
