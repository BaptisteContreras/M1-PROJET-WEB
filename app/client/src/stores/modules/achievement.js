// initial state
const state = {
    test: 1,

}

// getters
const getters = {
    getTest: (state) => {
        return state.test
    }
}

// actions
const actions = {
    setTest: (store, p )=> {
        store.commit('SET_TEST', p)
    },
}

// mutations
const mutations = {
    SET_TEST: (state, s) => {
        state.test = s
    },
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
