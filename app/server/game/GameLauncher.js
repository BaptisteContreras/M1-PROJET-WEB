const db = require('../storage/DataBase')()
const emitter = require('../event/Emitter')()
const events = require('../event/Events')
const gamesManager = require('../game/GameManager')();

class GameLauncher {


    constructor(db) {
        if (!!GameLauncher.instance) {
            return GameLauncher.instance;
        }

        GameLauncher.instance = this;

        this._db = db
        this._registerEvents()
        this._list = []
        return this;

    }

    _registerEvents(){

        emitter.getEmitterInstance().addListener(events.JOIN_LOBBY, (e) => {this._initLaunchGame(e)});
        emitter.getEmitterInstance().addListener(events.GAME_CAN_CONTINUE, (e) => {this._initLaunchGame(e)});
        emitter.getEmitterInstance().addListener(events.LEAVE_LOBBY, (e) => {this._stopLaunch(e)});
    }

    _initLaunchGame(e){
        let players = e.meta.players;
        let context = e.meta.params ? e.meta.params : {}
        if (this._canLaunchGame(context.game) && !this._isLaunchStarted(context.game)){
            let timeoutId = setTimeout(() => {
                this._launchGame(context.game.name)
                this._deleteFromList(context.game.name)
            }, context.game.launchTime)
            let launcher = {
                game : context.game.name,
                timeoutId

            }

            this._list.push(launcher)
            console.log("init launch")
        }
    }

    _launchGame(game){
        db.updateElement('games', game, {status : "active"})
        gamesManager.startGame(db.getElement('games', game))
    }


    manuallyLaunch(game){
        if (this._canLaunchGame(game) && !this._isLaunchStarted(game)){
            let timeoutId = setTimeout(() => {
                this._launchGame(game.name)
                this._deleteFromList(game.name)
            }, game.launchTime)
            let launcher = {
                game : game.name,
                timeoutId

            }

            this._list.push(launcher)
            console.log("init launch")
        }
    }

    _isLaunchStarted(game){
        return this._getLaunched(game) !== undefined
    }

    _getLaunched(game){
        return this._list.filter((el) => el.game == game)[0]
    }

    _deleteFromList(game){
        this._list = this._list.filter((el) => el.game != game)
    }

    _clearFromList(game){
        clearTimeout(this._getLaunched(game).timeoutId)
        this._deleteFromList(game)
    }

    _canLaunchGame(game, leave = false){
        return leave ?  game.waitingRoom.length - 1 >= game.minPlayer : game.waitingRoom.length >= game.minPlayer
    }

    _stopLaunch(e){
        let players = e.meta.players;
        let context = e.meta.params ? e.meta.params : {}
        console.log(this._canLaunchGame(context.game, true))
        console.log(this._isLaunchStarted(context.game.name))
        console.log(!this._canLaunchGame(context.game, true) && this._isLaunchStarted(context.game.name))
        if (!this._canLaunchGame(context.game, true) && this._isLaunchStarted(context.game.name)){
            console.log("not enought player..")
            this._clearFromList(context.game.name)
        }

    }



}

module.exports = function () {
    return new GameLauncher(db);
};

