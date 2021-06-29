var express = require('express');
var router = express.Router();
var utils = require('../utils/writer.js');
const canJoinGame = require('../utils/canJoin');
const checkAuth = require('../utils/auth');
var utils = require('../utils/writer.js');
const canPlayGame = require('../utils/canPlayGame')
const canSpectGame = require('../utils/canSpectate')
var gameService = require('../service/GameService');


router.get('/games', function (req, res) {

    let player = req.headers.plogin;

    checkAuth(req.headers.authentication, undefined)
        .then(async (authResp) => {
            let games = await gameService.gamesListGet(player);
            utils.writeJson(res, games);

        })
        .catch(() => {
            res.status(401).send('No auth');
        });


});

router.get('/games/:game', function (req, res) {

    let player = req.headers.plogin;

    checkAuth(req.headers.authentication, undefined)
        .then(async (authResp) => {
            gameService.gameListGet(player, req.params.game)
                .then(game => {
                    utils.writeJson(res, game);
                })
                .catch(() => res.status(404).send('Not found'))

        })
        .catch(() => {
            res.status(401).send('No auth');
        });


});

router.post('/games/:game/join', function (req, res) {
    console.log(req.body)
    let player = req.body.player;
    let game = req.params.game;
    checkAuth(req.headers.authentication, undefined)
        .then(async (authResp) => {
            if (!player ||  !canJoinGame(player, game, false)){
                res.status(400).send('Cannot join.');
            }else{
                await gameService.addPlayer(game, player)
                res.status(201).send('join ok.');
            }
        })
        .catch(() => {
            res.status(401).send('No auth');
        });
});

router.post('/games/:game/leave', function (req, res) {
    let player = req.body.player;
    let game = req.params.game;
    checkAuth(req.headers.authentication, undefined)
        .then(async (authResp) => {
            if (!player ||  game.status === "stop"){
                res.status(400).send('Cannot leave.');
            }else{
                await gameService.removePlayer(game, player)
                res.status(201).send('leave ok.');
            }
        })
        .catch(() => {
            res.status(401).send('No auth');
        });
});


router.post('/games/:game/can', function (req, res) {
    let player = req.body.player;
    let game = req.params.game;
    let action = req.body.action;
    console.log("action required : " + action)
    checkAuth(req.headers.authentication, undefined)
        .then(async (authResp) => {
            if (game && player){
                if (action === "play"){
                    let can = canPlayGame(game, player);
                    if (can){
                        res.send('Ok');
                    }else{
                        res.status(403).send('Not allowed');
                    }
                }else{
                    let spec = canSpectGame(game, player)
                    console.log("can spec ??" )
                    console.log(spec)
                    if (spec){
                        res.send('Ok');
                    }else{
                        res.status(403).send('Not allowed');
                    }
                }
            }else {
                res.status(400).send('Missing parameters');
            }
        })
        .catch(() => {
            res.status(401).send('No auth');
        });
});

router.post('/games/:game/initPlayer', function (req, res) {
    let player = req.body.player;
    let game = req.params.game;
    let media = req.body.media;
    console.log("media  required : " + media)
    checkAuth(req.headers.authentication, undefined)
        .then(async (authResp) => {
            if (game && player){
                if (media ===  "playscreen"){
                    let can = canPlayGame(game, player);
                    if (can){
                        gameService.gameInitPlayscreen(game,player)
                            .then((d) => {
                                utils.writeJson(res, d);

                            })
                            .catch((e) => {
                                console.log(e)
                            })
                    }else{
                        res.status(403).send('Not allowed');
                    }
                }else{
                    let can = canSpectGame(game, player);
                    if (can){
                        gameService.gameInitSpecscreen(game,player)
                            .then((d) => {
                                utils.writeJson(res, d);

                            })
                            .catch((e) => {
                                console.log(e)
                            })
                    }else{
                        res.status(403).send('Not allowed');
                    }

                }

            }else {
                res.status(400).send('Missing parameters');
            }
        })
        .catch(() => {
            res.status(401).send('No auth');
        });
});

router.get('/games/:game/lobby/refresh', function (req, res) {
    checkAuth(req.headers.authentication, undefined)
        .then(async (authResp) => {
            gameService.getLobby(req.params.game)
                .then((d)=> {
                    utils.writeJson(res,d)
                })
                .catch((e) => {
                    res.status(404).send('game not found.')
                })
        })
        .catch((e) => {
            res.status(401).send('No auth');
        });
});

router.get('/games/:game/refresh', function (req, res) {
    checkAuth(req.headers.authentication, undefined)
        .then(async (authResp) => {
            gameService.getResources(req.params.game)
                .then((d)=> {
                    // if (d.resources)
                    utils.writeJson(res,d)
                })
                .catch((e) => {
                    console.log(e)
                    res.status(404).send('game not found.')
                })
        })
        .catch((e) => {
            res.status(401).send('No auth');
        });
});



router.get('/games/:game/scores/:manche', function (req, res) {
    checkAuth(req.headers.authentication, undefined)
        .then(async (authResp) => {
            gameService.getScores(req.params.game, req.params.manche)
                .then((d)=> {
                    utils.writeJson(res,d)
                })
                .catch((e) => {
                    console.log(e)
                    res.status(404).send('game not found.')
                })
        })
        .catch((e) => {
            console.log(e)
            res.status(401).send('No auth');
        });
});

router.get('/games/:game/scores', function (req, res) {
    checkAuth(req.headers.authentication, undefined)
        .then(async (authResp) => {
            gameService.getScores(req.params.game, null)
                .then((d)=> {
                    utils.writeJson(res,d)
                })
                .catch((e) => {
                    console.log(e)
                    res.status(404).send('game not found.')
                })
        })
        .catch((e) => {
            console.log(e)
            res.status(401).send('No auth');
        });
});

module.exports = router;
