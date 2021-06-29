// initial state
const state = {
    // Player
    connected: false,
    token: null,
    loading: false,
    pseudo: null,
    url: null,
    gameList: [],
    gameDetails: null,
    tmpPlayerDetails: [],
    // Options
    lobbyRefreshInterval : 3000,
    gameRefreshInterval : 3000,
    notificationRefreshInterval : 4000,
    nbRefreshError : 0,
    lobbyRefreshId : null,
    gameRefreshId : null,
    notificationRefreshId : null,
    gpsId : null,
    acceptPushNotifs : false,


};

// getters
const getters = {
    isConnected: (state) => {
        return state.connected;
    },
    acceptPushNotifs: (state) => {
        return state.acceptPushNotifs;
    },
    isLoading: (state) => {
        return state.loading;
    },
    getToken: (state) => {
        return state.token;
    },
    getPseudo: (state) => {
        return state.pseudo;
    },
    getUrl: (state) => {
        return state.url;
    },
    getGameList: (state) => {
        return state.gameList;
    },
    getGameDetails: (state) => {
        return state.gameDetails;
    },
    getTmpPlayerDetails: (state) => {
        return state.tmpPlayerDetails;
    },
    getLobbyRefreshInterval: (state) => {
        return state.lobbyRefreshInterval;
    },
    getGameRefreshInterval: (state) => {
        return state.gameRefreshInterval;
    },
    getNotificationRefreshInterval: (state) => {
        return state.notificationRefreshInterval;
    },
    getNbRefreshError: (state) => {
        return state.nbRefreshError;
    },
    getLobbyRefreshId: (state) => {
        return state.lobbyRefreshId;
    },
    getGameRefreshId: (state) => {
        return state.gameRefreshId;
    },
    getNotificationRefreshId: (state) => {
        return state.notificationRefreshId;
    },
    getGpsId: (state) => {
        return state.gpsId;
    },

};

// actions
const actions = {
    setConnected: (store, p) => {
        store.commit('SET_CONNECTED', p);
    },
    setAcceptPushNotifs: (store, p) => {
        store.commit('SET_NOTIF_PERMISSION', p);
    },
    setToken: (store, p) => {
        store.commit('SET_TOKEN', p);
    },
    setLoading: (store, p) => {
        store.commit('SET_LOADING', p);
    },
    setPseudo: (store, p) => {
        store.commit('SET_PSEUDO', p);
    },
    setUrl: (store, p) => {
        store.commit('SET_URL', p);
    },
    setGameList: (store, p) => {
        store.commit('SET_GAMELIST', p);
    },
    setGameDetails: (store, p) => {
        store.commit('SET_GAMEDETAILS', p);
    },
    setTmpPlayerDetails: (store, p) => {
        store.commit('SET_TMPPLAYERDETAILS', p);
    },
    // OPTIONS
    setLobbyRefreshInterval: (store, p) => {
        store.commit('SET_LOBBY_REFRESH_INTERVAL', p);
    },
    setGameRefreshInterval: (store, p) => {
        store.commit('SET_GAME_REFRESH_INTERVAL', p);
    },
    setNotificationRefreshInterval: (store, p) => {
        store.commit('SET_NOTIFICATIONS_REFRESH_INTERVAL', p);
    },
    resetNbRefreshError: (store, p=null) => {
        store.commit('RESET_NB_REFRESH_ERROR', p);
    },
    incrementeNbRefreshError: (store, p=null) => {
       let current = store.commit('INCREMENTE_NB_REFRESH_ERROR', p);
    },
    setLobbyRefreshId: (store, p) => {
        store.commit('SET_LOBBY_REFRESH_ID', p);
    },
    setGameRefreshId: (store, p) => {
        store.commit('SET_GAME_REFRESH_ID', p);
    },
    setNotificationRefreshId: (store, p) => {
        store.commit('SET_NOTIFICATIONS_REFRESH_ID', p);
    },
    setGpsId: (store, p) => {
        store.commit('SET_GPS_REFRESH_ID', p);
    },

};

// mutations
const mutations = {
    SET_CONNECTED: (state, s) => {
        state.connected = s;
    },
    SET_TOKEN: (state, s) => {
        state.token = s;
    },
    SET_LOADING: (state, s) => {
        state.loading = s;
    },
    SET_PSEUDO: (state, s) => {
        state.pseudo = s;
    },
    SET_URL: (state, s) => {
        state.url = s;
    },
    SET_GAMELIST: (state, s) => {
        state.gameList = s;
    },
    SET_GAMEDETAILS: (state, s) => {
        state.gameDetails = s;
    },
    SET_TMPPLAYERDETAILS: (state, s) => {
        state.tmpPlayerDetails = s;
    },
    // OPTIONS
    SET_LOBBY_REFRESH_INTERVAL: (state, s) => {
        state.lobbyRefreshInterval = s;
    },
    SET_GAME_REFRESH_INTERVAL: (state, s) => {
        state.gameRefreshInterval = s;
    },
    SET_NOTIFICATIONS_REFRESH_INTERVAL: (state, s) => {
        state.notificationRefreshInterval = s;
    },
    RESET_NB_REFRESH_ERROR: (state, s) => {
        state.nbRefreshError = 0;
    },
    INCREMENTE_NB_REFRESH_ERROR: (state, s) => {
        return ++state.nbRefreshError;
    },
    SET_LOBBY_REFRESH_ID: (state, s) => {
        state.lobbyRefreshId = s;
    },
    SET_GAME_REFRESH_ID: (state, s) => {
        state.gameRefreshId = s;
    },
    SET_NOTIFICATIONS_REFRESH_ID: (state, s) => {
        state.notificationRefreshId = s;
    },
    SET_GPS_REFRESH_ID: (state, s) => {
        state.gpsId = s;
    },
    SET_NOTIF_PERMISSION: (state, s) => {
        state.acceptPushNotifs = s;
    },

};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
