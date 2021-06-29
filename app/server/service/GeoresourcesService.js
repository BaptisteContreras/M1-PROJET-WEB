const db = require('../storage/DataBase')()
'use strict';



/**
 * Get all living resources
 * Returns an array containing the representations of all existing resources in the game if the user is alive, or only that of the user if she is dead
 *
 * returns List
 **/
exports.resourcesGET = function() {
  return new Promise(function(resolve, reject) {

    var data = db.getAll('resources')
    if (Object.keys(data).length > 0) {
      resolve(data);
    } else {
      resolve();
    }
  });
}

exports.resourcesGETOne = function(el) {
  return new Promise(function(resolve, reject) {

    resolve(db.getElement('resources', el));

  });
}



/**
 * (re)set user's image URL
 * Sets or updates the user's photo/icon/... image file URL
 *
 * resourceId String User's login
 * url String
 * no response value expected for this operation
 **/
exports.resourcesResourceIdImagePUT = function(resourceId,url) {

  if (db.isExist('resources',resourceId)){
    url = url.url ? url.url : url
    db.updateElement('resources', resourceId,{url: url} )
  }


  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update user's position
 * Send a LatLng object to the server.
 *
 * resourceId String User's login
 * position LatLng User's position
 * no response value expected for this operation
 **/
exports.resourcesResourceIdPositionPUT = function(resourceId,position) {
  if (db.isExist('resources',resourceId)){
    db.updateElement('resources', resourceId,{position: {lat : position[0],lng : position[1]}})
  }
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

