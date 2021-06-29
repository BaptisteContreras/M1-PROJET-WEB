const db = require('../storage/DataBase')()


var canJoinGame =  function (player, game, isAdmin = true) {

    let current = db.getElement('games', game)
    if (!isAdmin && current.status !== "waiting") return false;
    if (!isAdmin && current.mode === "solo") return false;
    let isIncluded = current.players.includes(player)
    if (!isAdmin && isIncluded) return false;
    if (isIncluded) return true;
    if (current.players.includes(player)) return true;
    let all = db.getAll('games').filter((f) => f.status !== "stop")

    return all.filter((g) => g.players.includes(player)).length === 0;
}


module.exports = canJoinGame
