// initial state
const state = {
    current: null, // le lobby actuel
    inLobby : false,
    inGame: false,
    resources : null, // info de la game à update
    waitingRoom : [],
    playerList : [],
    scores : [],
    playerPos : null, // [lat,long]

}

// getters
const getters = {
    getCurrentGame: (state) => {
        return state.current
    },
    isGameRunning : (state) => {
        return state.current !== null && state.current.status === "active";
    },
    hasCurrentGame: (state) => {
        return state.current !== null
    },
    getCurrentManche: (state) => {
        return state.current ? state.current.currentManche : 0
    },
    getManches: (state) => {
        return state.current ? state.current.manches : []
    },
    getCurrentPlayersList: (state) => {
        return state.playerList
    },
    getWaitingRoom: (state) => {
        return  state.waitingRoom
    },
    isInLobby: (state) => {
        return state.inLobby
    },
    isInGame: (state) => {
        return state.inGame
    },
    getResources: (state) => {
        return state.resources
    },
    getScores: (state) => {
        return state.scores
    },
    getPlayerPos: (state) => {
        return state.playerPos
    },


}

// actions
const actions = {
    setCurrentGame: (store, p )=> {
        store.commit('SET_CURRENT', p)
        if (p){
            store.commit('SET_WAITING_ROOM', p.waitingRoom)
            store.commit('SET_PLAYER_LIST', p.players)
        }
    },
    setInLobby: (store, p )=> {
        store.commit('SET_INLOBBY', p)
    },
    setInGame: (store, p )=> {
        store.commit('SET_INGAME', p)
    },
    setScores: (store, p )=> {
        store.commit('SET_SCORES', p)
    },
    setPlayerPos: (store, p )=> {
        store.commit('SET_PPOS', p)
    },
    setResources: (store, p )=> {
        store.commit('SET_RESOURCES', p)
        if (p){
            store.commit('SET_WAITING_ROOM', p.waitingRoom)
            store.commit('SET_PLAYER_LIST', p.players.map(p => p.id))
        }
    },
}

// mutations
const mutations = {
    SET_CURRENT: (state, s) => {
        state.current = s
    },
    SET_INLOBBY: (state, s) => {
        state.inLobby = s
    },
    SET_INGAME: (state, s) => {
        state.inGame = s
    },
    SET_RESOURCES: (state, s) => {
        state.resources = s
    },
    SET_WAITING_ROOM: (state, s) => {
        state.waitingRoom = s
    },
    SET_PLAYER_LIST: (state, s) => {
        state.playerList = s
    },
    SET_SCORES: (state, s) => {
        state.scores = s
    },
    SET_PPOS: (state, s) => {
        state.playerPos = s
    },

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
