// initial state
const state = {
    scores : [],
    game : null,
    winner : null,
    ladder  : [],
    mancheWinner : null,



}

// getters
const getters = {
    getScores: (state) => {
        return state.scores
    },
    getGame: (state) => {
        return state.game
    },
    getWinner: (state) => {
        return state.winner
    },
    getLadder: (state) => {
        return state.ladder.reverse()
    },
    getMancheWinner: (state) => {
        return state.mancheWinner
    },
}

// actions
const actions = {
    setScores: (store, p )=> {
        store.commit('SET_SCORES', p)
    },
    setGame: (store, p )=> {
        store.commit('SET_GAME', p)
    },
    setWinner: (store, p )=> {
        store.commit('SET_WINNER', p)
    },
    setMancheWinner: (store, p )=> {
        store.commit('SET_MANCHER_WINNER', p)
    },

    setLadder: (store, p )=> {
        store.commit('SET_LADDER', p)
    },

}

// mutations
const mutations = {
    SET_SCORES: (state, s) => {
        state.scores = s
    },
    SET_GAME: (state, s) => {
        state.game = s
    },
    SET_WINNER: (state, s) => {
        state.winner = s
    },
    SET_MANCHER_WINNER: (state, s) => {
        state.mancheWinner = s
    },
    SET_LADDER: (state, s) => {
        state.ladder = s
    },
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
