const APP_VERSION = 2;
const DEV_PREFIX = '';
//const DEV_PREFIX = '/public';
const CACHE_NAME = 'PACC' + APP_VERSION;
const CACHE_TILES_NAME = 'PACC_TILES' + APP_VERSION;
let urlsToCache = [

    // EXTERNAL
    'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900',
    'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css',
    'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/fonts/materialdesignicons-webfont.woff2?v=4.9.95',
    'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2',
    'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',


    //  '/pac.png',
];
let urlsToCache2 = []
let urlsToCache3 = [
    // MAIN
    DEV_PREFIX + '/index.html',
    DEV_PREFIX + '/main.js',
    // IMAGES
   '/public/marker-icon.png',
    DEV_PREFIX + '/img/finished.png',
    DEV_PREFIX + '/img/gamepad.jpg',
    DEV_PREFIX + '/img/waiting.jpeg',
]
for (let i = 4; i <= 11; i++) {
    urlsToCache2.push(DEV_PREFIX + '/' + i + '.js');
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
const cachingTime = 30000; // Temps de cache
const cacheLimit = 130; // nombre d'éléments max dans le cache
const criticalCacheLimit = 180; // nombre d'élements à partir duquel on considère qu'il faut réduire en urgence le nombre d'éléments caché

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
                    resolve(cache.addAll(urlsToCache).catch((e) => {console.log("cache 1 failed")}));
                    resolve(cache.addAll(urlsToCache2).catch((e) => {console.log("cache 2 failed")}));
                    resolve(cache.addAll(urlsToCache3).catch((e) => {console.log("cache 3 failed")}));
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
                    return response;
                }
                let matchTilesUrl = event.request.url.match(tilesUrlRegex) !== null;
                if (matchTilesUrl) {
                    let cacheId = extractTilesUrlInfos(event.request.url);
                    let cachedResponse = useCache(cacheId);
                    if (!cachedResponse) {
                        return fetch(event.request).then((response) => {
                            let responseToCache = response.clone();
                           // console.log("cache response")
                            addToCache(cacheId, responseToCache);
                            return response;
                        });
                    } else {
                       // console.log("get tiles from cache")
                        return cachedResponse;
                    }
                } else {
                    return fetch(event.request);
                }

            })
            .catch((e) => {
                console.log("something wrong happened here")
                console.log(e)
            })
    );
});

self.addEventListener('activate', function (event) {

    event.waitUntil(
        caches.keys().then(async function (cacheNames) {
            console.log("remove old cache")
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
    internalCacheMap[identifierToString(identifier)] = {
        id: identifierToString(identifier),
        created_at: now,
        last_used_at: now,
        idClearFromCache: setCacheTimeout(identifier),
        response: response
    };

};
const setCacheTimeout = function (identifier) {
    return setTimeout(() => {
        clearFromCache(identifier);
    }, getBestCachingTime());
};
const clearFromCache = function (identifier) {
    //console.log("clear : " + identifierToString(identifier))
    delete internalCacheMap[identifierToString(identifier)];
};
const identifierToString = function (identifier) {
    return identifier.zoom + "-" + identifier.composant1 + "-" + identifier.composant2;
};

const useCache = function (identifier) {
    if (internalCacheMap[identifierToString(identifier)]) {
        clearTimeout(internalCacheMap[identifierToString(identifier)].idClearFromCache);
        internalCacheMap[identifierToString(identifier)].idClearFromCache = setCacheTimeout(identifier);
        internalCacheMap[identifierToString(identifier)].last_used_at = Date.now();
        return internalCacheMap[identifierToString(identifier)].response.clone();
    }
    return null;
};
const getBestCachingTime = function () {
    let currentCacheSize = Object.keys(internalCacheMap).length;
    //console.log("cache size : "+  currentCacheSize)
    if (currentCacheSize > cacheLimit){
        console.warn(currentCacheSize >= criticalCacheLimit ? "[SERVICE WORKER] : tiles cache critical limit reach. Caching time is divided by 4" : "[SERVICE WORKER] : tiles cache limit reach. Caching time is divided by 2")
        return currentCacheSize >= criticalCacheLimit ? cachingTime / 4 : cachingTime / 2;
        // Si il y a trop d'élement dans le cache, on divise par deux leur temps de caching
        // Si on atteint le seuil critique, on divise le temps de caching drastiquement, le but étant de faire baisser le taux d'occupation du cache au plus vite
    }
    return cachingTime;
}
