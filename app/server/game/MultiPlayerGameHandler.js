const GameHandler = require('./GameHandler')
const db = require('../storage/DataBase')()
const emitter = require('../event/Emitter')()
const events = require('../event/Events')

class MultiPlayerGameHandler extends GameHandler{
    constructor(db) {
        super(db)
        this._refreshTime = 1000; //ms

        if (!!MultiPlayerGameHandler.instance) {
            return MultiPlayerGameHandler.instance;
        }

        MultiPlayerGameHandler.instance = this;

        return this;
    }

    startGame(gameName){
        let game = this._getGame(gameName)
        game.mode = "multi"
        console.log("MULTI GAME STARTED")
        if (this._getGamePayload(gameName)){
            console.log("game already launched")
            return false
        }

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
        emitter.emit(events.MANCHE_START,game.players, {manche:cmanche})
        if (cmanche.id == "1" ){
            emitter.emit(events.GAME_START,game.players)
        }
    }
    stopGame(name){
        let p = this._getGamePayload(name)
        if (!p) return false
        clearInterval(p.rid)
        this._removeGame(name)
        let game = this._getGame(name)
        let cmanche = game.currentManche >= game.manches.length ? game.currentManche : game.currentManche+1;
        let status = game.currentManche >= game.manches.length ? "stop" : "waiting"
        let lastManche = game.manches.filter(m => m.id == game.currentManche)[0];
        let winner = this.findWinner(name,false)
        lastManche.winner = winner ? winner.id : winner
        let gwinner = status === "stop" ? this.findGameWinner(name) : null
        let f = {
            'currentManche' : cmanche,
            'status' : status,
            'mode'  : 'multi'

        }
        if (gwinner) f['winner'] = gwinner
        console.log("gwinner (multi) ?" + gwinner)
        emitter.emit(events.MANCHE_END,game.players,{"winner" : winner})
        if (status === "stop"){
            emitter.emit(events.GAME_END,game.players,{"winner" : gwinner})
        }else{
            emitter.emit(events.GAME_CAN_CONTINUE,game.players,{"game" : game})
        }
        this._db.updateElement('games', name, f)
    }
    findGameWinner(n){
        let p = this._getGame(n)
        let pscores = {}
        for (let i in p.players){
            let cplayer = p.players[i];
            pscores[cplayer] = {id:cplayer,nb:0}
        }
        p.manches.map((m) => pscores[m.winner]["nb"]++)
        let scoreArray = []
        for (let ps in pscores){
            scoreArray.push(pscores[ps])
        }

        scoreArray = scoreArray.sort((a,b) => a.nb > b.nb ? 1 : -1)
        return scoreArray[scoreArray.length - 1].id

    }
    findWinner(game, strict = false){
        let g = this._getGame(game)
        let cmanche = g.manches.filter(m => m.id == g.currentManche)[0];
        let goal = cmanche.targets.length
        let players = db.getAll('resources').filter(r => g.players.includes(r.id))
        let bests = []
        let best = null;
        let max = -1;
        for (let p in players){
            let current = players[p];
            if (current.owned.length > max){
                best = current
                max = current.owned.length
            }
            if (current.owned.length === goal){ // to handle equality
                bests.push(current)
            }
        }
        if (!strict){
            return best
        }
        if (goal ===  max){
            return best
        }
        return false;
    }
    _handleGame(gamePayload){
        //  console.log(gamePayload.ttl)
        this._decreaseTTL(gamePayload.id)
        if (this.isNullTTL(gamePayload.id) || this.findWinner(gamePayload.id, true)){
            this.stopGame(gamePayload.id)
        }
    }

}
module.exports = function () {
    return new MultiPlayerGameHandler(db);
};
