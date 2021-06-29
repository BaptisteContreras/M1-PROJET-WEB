var express = require('express');
var router = express.Router();
var utils = require('../utils/writer.js');
const checkAuth = require('../utils/auth');
var utils = require('../utils/writer.js');
var Georesources = require('../service/GeoresourcesService');
var playerService = require('../service/PlayerService');
var gameService = require('../service/GameService');


router.get('/players/:playersId/refresh', function (req, res) {

    checkAuth(req.headers.authentication, undefined)
        .then((authResp) => {
            console.log(authResp);
            Georesources.resourcesGETOne(req.params.playersId)
                .then(function (response) {
                    if (response) {
                        utils.writeJson(res, response);
                    } else {
                        playerService.playerRefresh(req.params.playersId).then((r) => {
                            utils.writeJson(res, r);
                        });
                    }
                })
                .catch(function (response) {

                    res.status(500).send('Technical error.');
                });
        })
        .catch(() => {
            res.status(401).send('No auth');
        });


});

router.post('/players/:player/leaveAll', function (req, res) {
    let player = req.params.player;
    checkAuth(req.headers.authentication, undefined)
        .then(async (authResp) => {
            if (player){
                let can = await gameService.leaveAllWaitingRooms(player)
                res.send("ok")
            }else {
                res.status(400).send('Missing parameters');
            }
        })
        .catch(() => {
            res.status(401).send('No auth');
        });
});

router.get('/players/:playersId', function (req, res) {

    checkAuth(req.headers.authentication, undefined)
        .then((authResp) => {
            console.log(authResp);
            Georesources.resourcesGETOne(req.params.playersId)
                .then(function (response) {
                    if (response) {
                        utils.writeJson(res, response);
                    } else {
                        res.status(404).send('Not found.');
                    }
                })
                .catch(function (response) {
                    res.status(500).send('Technical error.');
                });
        })
        .catch(() => {
            res.status(401).send('No auth');
        });


});

router.get('/players/:player/notifications', function (req, res) {
    checkAuth(req.headers.authentication, undefined)
        .then(async (authResp) => {
            playerService.getNotifications(req.params.player)
                .then((d)=> {
                    utils.writeJson(res,d)
                })
                .catch((e) => {
                    console.log(e)
                    res.status(404).send('player not found.')
                })
        })
        .catch((e) => {
            console.log(e)
            res.status(401).send('No auth');
        });
});

module.exports = router;
