const db = require('../storage/DataBase')()


var isActiveGame =  function (player, game, isId = true) {

    let current = db.getElement('games', game)
    return current.status !== "stop" && current.players.includes(player);
}


module.exports = isActiveGame
