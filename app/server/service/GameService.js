const db = require('../storage/DataBase')();
const gamesManager = require('../game/GameManager')();
const canJoinGame = require('../utils/canJoin');
const isActiveGame = require('../utils/isActiveGame');
var playerService = require('../service/PlayerService');
const emitter = require('../event/Emitter')()
const events = require('../event/Events')



exports.gamesGet = function () {
    return new Promise(function (resolve, reject) {
        resolve(db.getAll('games'));
    });
};
exports.gameInitPlayscreen = function (game, player) {
    return new Promise(function (resolve, reject) {
        game = db.getElement("games", game);
        if (!game) reject(false);
        let tmpWaiting = game.waitingRoom;
        // Ajout joueur à la salle d'attente
        if (!tmpWaiting.includes(player)) tmpWaiting.push(player);
        db.updateElement("games", game.id, {"waitingRoom": tmpWaiting});
        emitter.emit(events.JOIN_LOBBY,[player], {game:{...game}})
        resolve(db.getElement('games', game.id));
    });
};
exports.gameInitSpecscreen = function (game, player) {
    return new Promise(function (resolve, reject) {
        game = db.getElement("games", game);
        if (!game) reject(false);
        let tmpSpect = game.spectRoom;
        // Ajout joueur aux spectateurs
        if (!tmpSpect.includes(player)) tmpSpect.push(player);
        db.updateElement("games", game.id, {"spectRoom": tmpSpect});
        resolve(db.getElement('games', game.id));
    });
};


exports.gamesListGet = function (player) {
    return new Promise(function (resolve, reject) {
        let games = db.getAll('games');
        for (let i in games) {
            let game = games[i];
            game['isActiveGame'] = player ? isActiveGame(player, game.id) : false;
            game['canBeJoined'] = player ? canJoinGame(player, game.id, false) : false;
        }
        resolve(games);
    });
};
exports.gameListGet = function (player, game) {
    return new Promise(function (resolve, reject) {
        game = db.getElement('games', game);
        game['isActiveGame'] = player ? isActiveGame(player, game.id) : false;
        game['canBeJoined'] = player ? canJoinGame(player, game.id, false) : false;
        resolve(game);
    });
};

exports.gamesCreate = function (params) {
    return new Promise(function (resolve, reject) {
        var general = db.getAll('general')[0];
        var game = {
            id: params.name,
            name: params.name,
            players: [],
            manches: [],
            waitingRoom: [],
            spectRoom: [],
            winner: null,
            currentManche: 1,
            ttl: general.ttl,
            zoom: general.zoom,
            status: 'waiting',
            minPlayer : general.min,
            launchTime: general.launch,
        };
        db.addElement('games', game);
        resolve(true);
    });
};
exports.gameGetOne = function (name) {
    return new Promise(function (resolve, reject) {
        resolve(db.getElement('games', name));
    });
};

exports.deleteGame = function (name) {
    return new Promise(function (resolve, reject) {
        resolve(db.deleteElement('games', name));
    });
};
exports.updateFields = function (name, fields) {
    return new Promise(function (resolve, reject) {
        resolve(db.updateElement('games', name, fields));
    });
};
exports.addPlayer = function (name, player) {
    return new Promise(function (resolve, reject) {
        let game = db.getElement('games', name);
        game.players.push(player);
        resolve(db.updateElement('games', name, {'players': game.players}));
    });
};
exports.removePlayer = function (name, player) {
    return new Promise(function (resolve, reject) {
        let game = db.getElement('games', name);
        let newPlayers = game.players.filter((e) => e !== player);
        resolve(db.updateElement('games', name, {'players': newPlayers}));
    });
};

exports.leaveAllWaitingRooms = function (player) {
    return new Promise(function (resolve, reject) {
        let games = db.getAll("games").filter((g) => {
            return g.waitingRoom.includes(player);
        });
        for (let i in games) {
            let game = games[i];
            game.waitingRoom = game.waitingRoom.filter((g) => {
                return g !== player;
            });
            emitter.emit(events.LEAVE_LOBBY,[player], {game:{...game}})
            db.updateElement('games', game.id, {waitingRoom: game.waitingRoom});
        }

    });
};

exports.getLobby = function (game) {
    return new Promise(function (resolve, reject) {
        game = db.getElement('games', game);
        if (!game) {
            reject(false);
            return;
        }
        resolve(game);


    });
};

exports.startGame = function (game) {
    return new Promise(function (resolve, reject) {
        gamesManager.startGame(db.getElement('games', game))
        resolve(true)
    });
};

exports.stopGame = function (game) {
    return new Promise(function (resolve, reject) {
        console.log("STOP SIGNAL RECEIVE")
        gamesManager.stopGame(game)
        resolve(true)
    });
};
exports.getResources = function (game) {
    return new Promise( async function (resolve, reject) {
        game = db.getElement('games', game);
        game = {...game}
        if (!game) {
            reject(false);
            return;
        }
        let cmanche = {... game.manches.filter((m) => m.id == game.currentManche)[0]}
        cmanche.ttl =  gamesManager.getGameTTL(game.name)
        let  tmpPlayers = db.getAll('resources').filter((p) => game.players.includes(p.id)); // to avoid concurrency issue, get all players and work on it locally rather than use db
        let players = game.players.map(async p => {
            let tmp = tmpPlayers.filter(t => t.id == p)[0]
            return tmp ? tmp : await playerService.playerRefresh(p)
        })
        for (let p in players){
            players[p] = await players[p]
        }
        let res = {
            game: game.id,
            status: game.status,
            currentManche: game.currentManche,
            nbManches: game.manches.length,
            manche: cmanche,
            state: game.state,
            mode: game.mode,
            minPlayer: game.minPlayer,
            launchTime: game.launchTime,
            waitingRoom: game.waitingRoom,
            players: players.map((p) => {
                p = {...p}
                p.trophy = []
                return p;
            })

        };
        resolve(res);


    });
};

exports.checkPlayerPos = function (player) {
    let p = db.getElement('resources', player)
    let game  = this.getCurrentGameFor(player)
    if (!game) return false;
    let currentManche = game.manches.filter(m => m.id == game.currentManche)[0]
    for (let t in currentManche.targets){
        let ctarget = currentManche.targets[t];
        if (this.canOwn(p,ctarget) && !p.owned.includes(ctarget.id)){
            console.log(player + "can own " + ctarget.id + "  ( " + ctarget.name + " )")
            emitter.emit(events.CAPTURE_TARGET,[player], {target:ctarget})
            p.owned.push(ctarget.id)
        }
    }

};
function calculateDistance(lat1,lon1,lat2,lon2){
    const R = 6371e3; // metres
    const q1 = lat1 * Math.PI/180; // φ, λ in radians
    const q2 = lat2 * Math.PI/180;
    const q3 = (lat2-lat1) * Math.PI/180;
    const number = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(q3/2) * Math.sin(q3/2) +
        Math.cos(q1) * Math.cos(q2) *
        Math.sin(number/2) * Math.sin(number/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
}
exports.canOwn = function (player, target) {
    if (!player || !target) return false;
    let plat, plng, tlat, tlng = 0;
    plat = player.position.lat;
    plng = player.position.lng;
    tlat = target.pos[0]
    tlng = target.pos[1]

    let diff = calculateDistance(plat,plng,tlat,tlng)
    console.log("dist : " + diff)
    return diff <= 2;
};
exports.getCurrentGameFor = function (player) {
     let g = db.getAll('games').filter(g => g.status !== "stop" && g.players.includes(player))
    if (g){
        return g[0]
    }
    return null;


};
exports.getPlayerIdList = function (userList) {
    let tmp = [];
    for (let i in userList) {
        let user = userList[i];
        let id = user.id ? user.id : user.login;
        tmp.push(id);
    }
    return tmp;
};

exports.availablePlayer = function (gameName, userList) {
    return new Promise(function (resolve, reject) {
        let current = db.getElement('games', gameName);
        if (!current) {
            resolve([]);
        }

        resolve(userList.filter((c) => !current.players.includes(c) && canJoinGame(c, gameName)));
    });
};

exports.getScores =  function (gameName, manche) {
    return new Promise( function (resolve, reject) {
        let current = db.getElement('games', gameName);
        manche = manche ? current.manches.filter((m) => m.id == manche)[0] : null;

        let res = {
            "gwinner" : current.winner,
            "scores" : manche ?
                [{
                    'manche' : manche.id,
                    'winner' : manche.winner
                }] :
                current.manches.map(c => { return {
                    'manche' : c.id,
                    'winner' : c.winner
                }})
        }
        if (!manche){
            let pscores = {}
            for (let i in current.players){
                let cplayer = current.players[i];
                pscores[cplayer] = {id:cplayer,nb:0}
            }
            let scoreArray = []
            if (current.state !== 'fail'){
                current.manches.map((m) => pscores[m.winner]["nb"]++)
                for (let ps in pscores){
                    scoreArray.push(pscores[ps])
                }
            }
            scoreArray = scoreArray.sort((a,b) => a.nb > b.nb ? 1 : -1)
            res['final'] = scoreArray
            res['status'] = current.state !== 'fail' ? 'ok' : 'fail'
        }
        resolve( res)
    });
};

exports.getMancheForGame = function (gameName, manche) {
    return new Promise(function (resolve, reject) {
        let current = db.getElement('games', gameName);
        return current.manches.filter((m) => m.id == manche)[0]
    });
};


exports.handleMancheInputs = function (inputs) {
    let nbManche = inputs["nbManches"];
    if (!nbManche || nbManche === 0) {
        return false;
    }
    let mancheArray = [];
    for (let i = 0; i < nbManche; i++) {
        let mancheId = i + 1;
        let manche = {};
        manche["id"] = mancheId;

        manche["ttl"] = inputs["ttl" + mancheId];
        //if (!manche["ttl"]) return false;
        let nbTarget = 0;
        while (inputs["tname" + mancheId + "-" + (nbTarget + 1)]) {
            nbTarget++;
        }
        if (nbTarget === 0) return false;
        let mancheTargets = [];
        for (let i = 1; i <= nbTarget; i++) {
            let tmpTarget = {};
            tmpTarget["id"] = i;
            tmpTarget['name'] = inputs["tname" + mancheId + "-" + i];
            tmpTarget['url'] = inputs["turl" + mancheId + "-" + i];
            tmpTarget['pos'] = inputs["tpos" + mancheId + "-" + i];
            if (!tmpTarget['name'] || !tmpTarget['pos']) return false;
            tmpTarget['pos'] = tmpTarget["pos"].split("/");
            if (tmpTarget['pos'].length !== 2) return false;
            mancheTargets.push(tmpTarget);
        }

        manche["targets"] = mancheTargets;
        manche["winner"] = null;
        mancheArray.push(manche);
    }
    return mancheArray;
};
