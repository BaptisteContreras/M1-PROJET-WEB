var express = require('express');
var parser = require('body-parser');
var router = express();
// set the view engine to ejs
router.set('view engine', 'ejs');
router.use(parser.urlencoded({extended: false}));
router.use(parser.json());
const checkAuth = require('../utils/auth');
const canJoinGame = require('../utils/canJoin');
const helper = require('../utils/helper');
var playerService = require('../service/PlayerService');
var geoService = require('../service/GeoresourcesService');
var generalService = require('../service/GeneralService');
var gameService = require('../service/GameService');
var utils = require('../utils/writer.js');
var trophyManager = require('../trophy/TrophyManager')()
var events = require('../event/Events')
var emitter = require('../event/Emitter')()


const axios = require('axios');


// index page
router.get('/', async function (req, res) {
    res.render('pages/game', {
        games: await gameService.gamesGet(),
        helper
    });
});

// user page
router.get('/user', function (req, res) {
    axios.get('http://192.168.75.6/spring/users')
        .then(async response => {
            let users = [];
            let springUsers = response.data.users;
            for (let i in response.data.users) {
                let u = springUsers[i];
                let cu = springUsers[i];
                u = await geoService.resourcesGETOne(u)
                if (!u){
                    u = await playerService.playerRefresh(cu)
                }
                let res = await axios.get('http://192.168.75.6/spring/user/'+u.id)
                u.connected = res.data.user.connected
                users.push(u);
            }
            res.render('pages/user', {
                users,
                helper
            });
        })
        .catch(error => {
            console.log(error);
            res.render('pages/error', {
                error: error
            });
        });
});

router.post('/user/create', function (req, res) {
    var user = {
        login: req.body.login,
        password: req.body.password
    };
    axios.post('http://192.168.75.6/spring/users', user);
    res.redirect('../user');
});

router.post('/user/delete', function (req, res) {
    axios.delete('http://192.168.75.6/spring/user/' + req.body.login).then(() => playerService.deletePlayer(req.body.login))
    res.redirect('../user');
});

router.post('/user/modifyPage', async function (req, res) {
    let user = await geoService.resourcesGETOne(req.body.login)
    if (!user){
        user = await playerService.playerRefresh(req.body.login);
    }
    res.render('pages/modifyUser', {
        user,
        helper
    });
});

router.post('/user/modify', function (req, res) {
    let url = req.body.url;
    let login = req.body.login;
    let password= req.body.password
    var user = {
        login,
        password
    };
    if (password && password !== "" && password !== " "){
        axios.put('http://192.168.75.6/spring/user/' + req.body.oldLogin, user);
    }

    geoService.resourcesResourceIdImagePUT(req.body.oldLogin,url)
    res.redirect('../user');
});

router.get('/game/:game/manches', async function (req, res) {
    let game = await gameService.gameGetOne(req.params.game)

    res.render('pages/editManches', {
        game,
        helper
    });
});
router.patch('/game/:game/manches', async function (req, res) {
    let game = req.params.game;
    let resolved = gameService.handleMancheInputs(req.body)
    if (!resolved || !game){
        res.status(400).send("Le formulaire contient des erreurs");
    }else{
        gameService.updateFields(game, {"manches":resolved})
        res.send("ok")
    }
});
// game page
router.get('/game', async function (req, res) {
    res.render('pages/game', {
        games: await gameService.gamesGet(),
        helper
    });
});

router.post('/game/create', async function (req, res) {
    if (! await gameService.gameGetOne(req.body.name)){
        gameService.gamesCreate(req.body)
    }
    res.redirect('../game');
});

router.post('/game/delete', function (req, res) {
    gameService.deleteGame(req.body.name)
    res.redirect('../game');
});

router.post('/game/activate', function (req, res) {
    gameService.updateFields(req.body.name, {status : "active"})
    gameService.startGame(req.body.name)
    res.redirect('../game');
});
router.get('/a', async function (req, res) {
    await gameService.updateFields('a',{
        'manches' : [{
            'id' : '1',
            'winner' : null,
            'targets' : [
                {
                    id : '1',
                    pos : ['45.7849', '4.8693'],
                    url : null,
                    name : "cible 1"
                },
                {
                    id : '2',
                    pos : ['45.784', '4.8634'],
                    url : 'https://image.flaticon.com/icons/svg/825/825590.svg',
                    name : "cible 2"
                }
            ],
            'ttl': 42
        },
        ]
    })
    let result = await gameService.gamesGet()

    utils.writeJson(res, result);
});

router.get('/b', async function (req, res) {
    let result = await gameService.gamesGet()

    utils.writeJson(res, result);
});

router.get('/c', async function (req, res) {
    let result = await playerService.getAll()

    utils.writeJson(res, result);
});
router.get('/q', async function (req, res) {
    let result = ''
    emitter.emit(events.GAME_END,["bapt"])
    utils.writeJson(res, result);
});
router.post('/game/stop', function (req, res) {
    gameService.stopGame(req.body.name)

    res.redirect('../game');
});

router.post('/game/modifyPage', async function (req, res) {
    var game = await gameService.gameGetOne(req.body.name)
    axios.get('http://192.168.75.6/spring/users')
        .then(async response => {
            var players = response.data.users;
            var availableplayers = await gameService.availablePlayer(game.name, players)
            res.render('pages/modifyGame', {
                game: game,
                players: availableplayers,
                helper
            });
        })
        .catch(error => {
            console.log(error);
            res.render('pages/error', {
                error: error
            });
        });
});

router.post('/game/modify', async function (req, res) {
    let oldname = req.body.oldName;
    var players = [];
    if (req.body.players != null) {
        if (Array.isArray(req.body.players)) {
            req.body.players.forEach(function (player) {
                if (canJoinGame(player,oldname)){
                    players.push(player);
                }
            });
        } else {
            if (canJoinGame(req.body.players,oldname)){
                players.push(req.body.players);
            }
        }
    }
    if (req.body.possibleplayers != null) {
        if (Array.isArray(req.body.possibleplayers)) {
            req.body.possibleplayers.forEach(function (player) {
                if (canJoinGame(player,oldname)){
                    players.push(player);
                }
            });
        } else {
            if (canJoinGame(req.body.possibleplayers, oldname)){
                players.push(req.body.possibleplayers);
            }
        }
    }

    var game = {
        name: req.body.name,
        players: players,
        ttl: req.body.ttl,
        zoom: req.body.zoom,
        launchTime : req.body.launchTime,
        minPlayer : req.body.minPlayer > 0 ? req.body.minPlayer : 1
    };

    await gameService.updateFields(oldname, game)

    res.redirect('../game');
});

// general page
router.get('/general', async function (req, res) {
    res.render('pages/general', {
        general: await generalService.generalGet(),
        helper
    });
});

router.post('/general/modify', function (req, res) {
    generalService.updateFields({
        ttl: req.body.ttl,
        zoom: req.body.zoom,
        launch: req.body.launch,
        min: req.body.min
    })
    res.redirect('../general');
});

module.exports = router;
