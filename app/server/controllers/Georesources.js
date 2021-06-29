'use strict';

const checkAuth = require('../utils/auth')
var utils = require('../utils/writer.js');
var Georesources = require('../service/GeoresourcesService');
var gameService = require('../service/GameService');


module.exports.resourcesGET = function resourcesGET (req, res, next) {
  checkAuth(req.get('authentication'),req.get('origin'))
      .then(() => {
          Georesources.resourcesGET()
              .then(function (response) {
                  utils.writeJson(res, response);
              })
              .catch(function (response) {
                  utils.writeJson(res, response);
              });
      })
      .catch(() => {
        res.status(401).send('No auth')
      })
};

module.exports.resourcesGETOne = function resourcesGETOne (req, res, next) {
    var resourceId = req.swagger.params['resourceId'].value;
    console.log('kdkl')
    checkAuth(req.get('authentication'),req.get('origin'))
        .then(() => {
            Georesources.resourcesGETOne(resourceId)
                .then(function (response) {
                    utils.writeJson(res, response);
                })
                .catch(function (response) {
                    utils.writeJson(res, response);
                });
        })
        .catch(() => {
            res.status(401).send('No auth')
        })
};

module.exports.resourcesResourceIdImagePUT = function resourcesResourceIdImagePUT (req, res, next) {
    var resourceId = req.swagger.params['resourceId'].value;
    var url = req.swagger.params['url'].value;
    if (typeof url === "string"){
        url = JSON.parse(url)
    }
    checkAuth(req.get('authentication'),req.get('origin'))
        .then(() => {
            Georesources.resourcesResourceIdImagePUT(resourceId,url)
                .then(function (response) {
                    utils.writeJson(res, response);
                })
                .catch(function (response) {
                    utils.writeJson(res, response);
                });
        })
        .catch(() => {
            res.status(401).send('No auth')
        })
};
    // Start the server
module.exports.resourcesResourceIdPositionPUT = function resourcesResourceIdPositionPUT (req, res, next) {
    var resourceId = req.swagger.params['resourceId'].value;
    var position = req.swagger.params['position'].value;

    checkAuth(req.get('authentication'),req.get('origin'))
        .then(() => {
            Georesources.resourcesResourceIdPositionPUT(resourceId,position)
                .then(function (response) {
                    gameService.checkPlayerPos(resourceId)
                    utils.writeJson(res, response);
                })
                .catch(function (response) {
                    console.log(response)
                    utils.writeJson(res, response);
                });
        })
        .catch((e) => {
            console.log(e)
            res.status(401).send('No auth')
        })
};
