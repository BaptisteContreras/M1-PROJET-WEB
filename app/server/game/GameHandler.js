const db = require('../storage/DataBase')()
const emitter = require('../event/Emitter')()
const events = require('../event/Events')


class GameHandler {


    constructor(db) {
        this._db = db
        this._activeGames = []
        this._refreshTime = 1000; //ms
    }


    stopGame(name){}
    findGameWinner(n){}
    findWinner(game, strict = false){}
    _handleGame(gamePayload){}


    startGame(gameName){
        let game = this._getGame(gameName)
        let cmanche = game.manches.filter(m => m.id == game.currentManche)[0];
        let gamePayload = {
            id : gameName,
            baseTTL : cmanche.ttl,
            ttl : cmanche.ttl,
        }
        let players = db.getAll('resources').filter(r => game.players.includes(r.id))
        players.map(p => {
            p.owned = []
        })
        let rid = setInterval(() => {
            this._handleGame(gamePayload)
        }, this._refreshTime)
        gamePayload['rid'] = rid;
        this._addGame(gamePayload)
    }

    _decreaseTTL(game){
        this._getGamePayload(game)['ttl']--
    }
    getGameTTL(game){
        if (!this._getGamePayload(game)){
            return 0;
        }
        return this._getGamePayload(game)['ttl'];
    }
    isNullTTL(game){
        return this._getGamePayload(game)['ttl'] <= 0;
    }

    _getGame(name){
        return this._db.getElement('games', name)
    }
    _removeGame(name){
        this._activeGames = this._activeGames.filter(obj => obj.id !== name);
    }
    _getGamePayload(id){
        return this._activeGames.filter(obj => obj.id === id)[0]
    }

    _addGame(game){
        this._removeGame(game.id)
        this._activeGames.push(game)
    }
}

module.exports = GameHandler
