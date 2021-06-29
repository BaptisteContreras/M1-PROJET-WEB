import Vue from 'vue'
import Vuex from 'vuex'
import game from './modules/game'
import general from './modules/general'
import trophy from './modules/trophy'
import results from './modules/results'
import notifications from './modules/notification'
import achievement from './modules/achievement'


Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        game,
        achievement,
        general,
        trophy,
        notifications,
        results
    }
})
