const TrophyNotification = require('./TrophyNotification')

class NotificationDispatcher {

    constructor() {
        this._eventPool = {}

        if (!!NotificationDispatcher.instance) {
            return NotificationDispatcher.instance;
        }

        NotificationDispatcher.instance = this;

        return this;
    }

    flush(dest){
        let data = this._getOrInit(dest).map((e) => e.send())
        this._resetPool(dest)
        return data;
    }

    dispatch(event){
        this._addToPool(event.getTo(), event)
    }
    _getOrInit(dest){
        let pool = this._eventPool[dest];
        if (!pool) return this._initPool(dest)
        return pool
    }
    _initPool(dest){
        this._eventPool[dest] = []
        return this._eventPool[dest];
    }
    _resetPool(dest){
       return this._initPool(dest)
    }
    _addToPool(dest, event){
        this._getOrInit(dest).push(event)
    }




}


module.exports = function () {
    return new NotificationDispatcher();
};
