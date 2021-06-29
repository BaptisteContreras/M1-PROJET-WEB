
const db = require('../storage/DataBase')()


var canPlayGame =  function (game,player) {

    game = db.getElement("games", game)
    return game && game.status !== "stop" && game.players.includes(player)

}


module.exports = canPlayGame
