import {openDB, deleteDB, wrap, unwrap} from 'idb';

const APP_VERSION = Date.now();
const IDB_VERSION = Date.now();
//const DEV_PREFIX = '';
const DEV_PREFIX = '/public';
const CACHE_NAME = 'PACC' + APP_VERSION;
const IDB_NAME = 'tilesCache';
const CACHE_TILES_NAME = 'PACC_TILES' + APP_VERSION;
let urlsToCache = [
    // MAIN
    DEV_PREFIX + '/index.html',
    DEV_PREFIX + '/main.js',
    // EXTERNAL
    'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900',
    'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css',
    'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/fonts/materialdesignicons-webfont.woff2?v=4.9.95',
    'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2',
    'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
    // IMAGES
    DEV_PREFIX + '/marker-icon.png',
    DEV_PREFIX + '/img/finished.png',
    DEV_PREFIX + '/img/gamepad.jpg',
    DEV_PREFIX + '/img/waiting.jpeg',

    //  '/pac.png',
];

for (let i = 0; i <= 11; i++) {
    urlsToCache.push(DEV_PREFIX + '/' + i + '.js');
}
const currentCacheWhiteList = [CACHE_NAME, CACHE_TILES_NAME];
const tilesUrlRegex = 'https:\/\/api.tiles.mapbox.com';
/**
 * clé : zoom+composant1+composant2
 * valeur : {
 *     created_at, // date ajout du composant dans le cache
 *     last_used_at, // date dernière utilisation
 *     idClearFromCache // id du setTimeout qui va clear la tile du cache si elle n'est pas utilisée pendant X secondes
 * }
 * @type {{}}
 */
let internalCacheMap = {};
const cachingTime = 20000;
let db;

let tilesStore;
self.addEventListener('install', function (event) {
    // Perform install steps
    console.log("[SERVICE WORKER] : install");
    console.log("[SERVICE WORKER] : CACHE VERSION " + APP_VERSION);
    console.log("[SERVICE WORKER] : CACHE NAME " + CACHE_NAME);
    console.log("[SERVICE WORKER] : CACHE DEV PREFIX " + DEV_PREFIX);
    event.waitUntil(new Promise(async (resolve, reject) => {
            caches.open(CACHE_NAME)
                .then(async function (cache) {
                    console.log('Opened cache');
                    await createDB();
                    resolve(cache.addAll(urlsToCache));
                })
                .catch((e) => {
                    console.log("[SERVICE WORKER] : FAILED");
                    console.log(e);
                    reject(false);
                });
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    console.log("[SERVICE WORKER] : CACHE HIT FOR " + event.request.url);
                    return response;
                }
                let matchTilesUrl = event.request.url.match(tilesUrlRegex) !== null;
                if (matchTilesUrl) {
                    let cacheId = extractTilesUrlInfos(event.request.url);
                    let blob = useCache(cacheId)
                    if ( !blob) {
                        console.log("cache blob")
                        return fetch(event.request).then((response) => {
                            let responseToCache = response.clone();
                            addToCache(cacheId, responseToCache);
                            return response;
                        });
                    } else {
                        console.log("blob foundd");
                        console.log(blob)
                        return blob;
                    }
                    /**
                     return db.get('tiles', identifierToString(cacheId)).then((blobFound) => {

                        });
                     **/
                } else {
                    return fetch(event.request);
                }

            })
            .catch(e => {
                console.log("[SERVICE WORKER] : FETCH FAILED");
                console.log(e);
                reject(e);
            })
    );
});

self.addEventListener('activate', function (event) {

    event.waitUntil(
        caches.keys().then(async function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (currentCacheWhiteList.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

const extractTilesUrlInfos = function (url) {
    let splitted = url.split('/');
    let tilesIdentifier = {
        zoom: splitted[5],
        composant1: splitted[6],
        composant2: splitted[7].split('.')[0]
    };
    return tilesIdentifier;
};

const addToCache = function (identifier, response) {
    let now = Date.now();
    let timeoutID = setTimeout(() => {
        clearFromCache(identifier);
    }, cachingTime);
    internalCacheMap[identifierToString(identifier)] = {
        id: identifierToString(identifier),
        created_at: now,
        last_used_at: now,
        idClearFromCache: timeoutID,
        response: response
    }
    /*
    db.add('tiles', {
        id: identifierToString(identifier),
        created_at: now,
        last_used_at: now,
        idClearFromCache: timeoutID,
        response: response
    });

     */
    /**
     internalCacheMap[identifierToString(identifier)] = {
        created_at : now,
        last_used_at : now,
        idClearFromCache : timeoutID
    }**/

    //https://stackoverflow.com/questions/39810980/store-api-response-in-indexeddb

};
const clearFromCache = function (identifier) {
    //db.delete('tiles', identifierToString(identifier));
    internalCacheMap[identifierToString(identifier)]= null
    console.log("clear " + identifierToString(identifier) + " from cache");
};
const identifierToString = function (identifier) {
    return identifier.zoom + "-" + identifier.composant1 + "-" + identifier.composant2;
};
const useCache = function (identifier) {
    if (internalCacheMap[identifierToString(identifier)]){
        return internalCacheMap[identifierToString(identifier)].response.clone()
    }
    return null;
};

const createDB = async function () {
    db = await openDB(IDB_NAME, IDB_VERSION, {
        upgrade: (db) => {
            db.createObjectStore('tiles', {
                keyPath: 'id',
                autoIncrement: false
            });
            console.log("db up");
        },
        blocked() {
            console.log("je suis bloqué");
        },
    });


};

const deleteFromCache = function (identifier) {

};
