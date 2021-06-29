const EventsLib = require('events');

class Emitter {
    constructor() {
        if (!!Emitter.instance) {
            return Emitter.instance;
        }
        this._internal = new EventsLib.EventEmitter();

        Emitter.instance = this;

        return this;
    }
    getEmitterInstance(){
        return this._internal
    }

    emit(type,players,params= []){
        console.log("Emit event : " + type + " with players : " + players + " with context : " + params)
        this._internal.emit(type, {
            meta : {
                type : type,
                players : players,
                params
            }
        })
    }

}

module.exports = function () {
    return new Emitter();
};
