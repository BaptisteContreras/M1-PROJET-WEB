// initial state
const state = {
    trophies: [],
    playerTrophies: []

}

// getters
const getters = {
    getTrophies: (state) => {
        return state.trophies
    },
    getPlayerTrophies: (state) => {
        return state.playerTrophies
    },
}

// actions
const actions = {
    setTrophies: (store, p )=> {
        store.commit('SET_TROPHIES', p)
    },
    setPlayerTrophies: (store, p )=> {
        store.commit('SET_PLAYER_TROPHIES', p)
    },
    unLockTrophy: (store, p )=> {
        store.commit('UNLOCK_TROPHY', p)
    },
}

// mutations
const mutations = {
    SET_TROPHIES: (state, s) => {
        state.trophies = s
    },
    SET_PLAYER_TROPHIES: (state, s) => {
        state.playerTrophies = s
    },
    UNLOCK_TROPHY: (state, s) => {
        console.log(s)
        state.playerTrophies.filter(t => t.id === s)[0].done = true;
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
