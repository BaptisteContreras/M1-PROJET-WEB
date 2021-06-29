const multiPlayerGameHandler = require('./MultiPlayerGameHandler')()
const soloPlayerGameHandler = require('./SoloPlayerGameHandler')()

class GameManager {

    constructor(multiPlayerGameHandler,soloPlayerGameHandler) {
        this._multiPlayerGameHandler = multiPlayerGameHandler
        this._soloPlayerGameHandler = soloPlayerGameHandler

        if (!!GameManager.instance) {
            return GameManager.instance;
        }

        GameManager.instance = this;

        return this;
    }

    startGame(game){
        if (game.players.length > 1 ){
            this._multiPlayerGameHandler.startGame(game.id)
        }else{
            this._soloPlayerGameHandler.startGame(game.id)
        }
    }
    stopGame(game){
        this._multiPlayerGameHandler.stopGame(game)
        this._soloPlayerGameHandler.stopGame(game)
    }

    getGameTTL(game){
        return this._multiPlayerGameHandler.getGameTTL(game) + this._soloPlayerGameHandler.getGameTTL(game)
    }
    debug(){
        console.log("Multi : ")
        console.log(this._multiPlayerGameHandler.debug())
        console.log("Solo : ")
        console.log(this._soloPlayerGameHandler.debug())
    }
}

module.exports = function () {
    return new GameManager(multiPlayerGameHandler,soloPlayerGameHandler);
};
