// initial state
const state = {
    pool : [],
    currentId : 1,

}

// getters
const getters = {
    getNotifications: (state) => {
        return state.pool
    },
    getRedNotifications: (state) => {
        return state.pool.filter((n) => n.read)
    },
    getUnreadNotifications: (state) => {
        return state.pool.filter((n) => !n.read)
    },
    getNbNotifications: (state) => {
        return state.pool.length
    },
    getCurrentId: (state) => {
        return state.currentId
    },
    getNbUnreadNotifications: (state) => {
        return state.pool.filter((n) => !n.read).length
    },
}

// actions
const actions = {
    setNotifications: (store, p )=> {
        store.commit('SET_NOTIFICATIONS', p)
    },
    resetNotifications: (store, p )=> {
        store.commit('RESET_POOL', p)
    },
    pushNotifications: (store, d )=> {
        let p = d.d
        let _this = d._this
        p.forEach((n) => {
            n['read'] = false
            n['id'] = getters.getCurrentId(store.state)
            store.dispatch('pushNotification', n)
            if (n.type === 'unlock'){
                _this.unLockTrophy(n.data.id)
            }
        })
    },
    pushNotification: (store, p )=> {
        store.commit('ADD_NOTIFICATION', p)
        store.commit('INCREMENTE_ID', p)
    },
    readNotif: (store, p )=> {
        store.commit('READ_NOTIFICATION', p)
    },
}

// mutations
const mutations = {
    SET_NOTIFICATIONS: (state, s) => {
        state.pool = s
    },
    RESET_POOL: (state, s) => {
        state.pool = []
    },
    ADD_NOTIFICATION: (state, s) => {
        state.pool.push(s)
    },
    READ_NOTIFICATION: (state, s) => {
        state.pool.filter((n) => n.id === s)[0].read = true
    },
    INCREMENTE_ID: (state, s) => {
        state.currentId++
    },
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
