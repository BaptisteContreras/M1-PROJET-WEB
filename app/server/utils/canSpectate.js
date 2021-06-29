const db = require('../storage/DataBase')()


var canSpectateGame =  function (game,player) {

    game = db.getElement("games", game)
    return game && game.status !== "stop" && !game.players.includes(player)
}


module.exports = canSpectateGame
