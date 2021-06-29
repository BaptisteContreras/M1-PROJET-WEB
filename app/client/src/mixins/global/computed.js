import {mapGetters} from 'vuex'




export default {

    getImageUrl () {
      return this.getUrl ? this.getUrl : '/pac.png'
    },
    getPlayerStatus () {
        if (!this.getResources){
            return {
                owned : []
            }
        }
        return this.getResources.players.filter(pp => pp.id === this.getPseudo)[0]
    },
    getLeader() {
        if (!this.getResources){
            return {
                name : "Loading",
                nb : 0
            }
        }
        let current = {
            owned : [],
            id : 'NaN'
        }
        let max = -1

        this.getResources.players.map(c => {
            if (c.owned.length > max){
                current = c
                max = c.owned.length
            }
        })

        return {
            name : current.id,
            nb : current.owned.length
        };
    },

    getRemaningTime(){
        if (!this.getResources) return "Loading..."
        return this.getResources.manche.ttl
    },
    getNbPlayerWaiting() {
        return this.getWaitingRoom.length + " / " + this.getCurrentPlayersList.length;
    },
    getManche(){
        return this.getCurrentManche + " / " + this.getManches.length
    },
    getChipColor(){
        if (!this.getCurrentGame) return 'red'
        return  this.getCurrentGame.status === 'stop' ? 'red' : this.getCurrentGame.status === 'waiting' ? 'orange' : 'green';
    },
    getChipText(){
        if (!this.getCurrentGame) return 'Unknow'
        return  this.getCurrentGame.status === 'stop' ? 'Terminée' : this.getCurrentGame.status === 'waiting' ? 'En attente' : 'En cours';
    },
    getTimeColor(){
        let t  = this.getRemaningTime
        if (t === "Loading..." || t <= 60){
            return 'red'
        }
        if (t <= 120){
            return 'orange'
        }
        return 'green'
    },


    ...mapGetters({

        getToto: 'achievement/getTest',
        getCurrentGame: 'game/getCurrentGame',
        getResources: 'game/getResources',
        hasCurrentGame: 'game/hasCurrentGame',
        getCurrentManche: 'game/getCurrentManche',
        getMancheWinner: 'results/getMancheWinner',
        getScores: 'results/getScores',
        getWinner: 'results/getWinner',
        getGameResult: 'results/getGame',
        getLadder: 'results/getLadder',
        isGameRunning: 'game/isGameRunning',
        getPlayerPos: 'game/getPlayerPos',
        isInGame: 'game/isInGame',
        getManches: 'game/getManches',
        getCurrentPlayersList: 'game/getCurrentPlayersList',
        isInLobby: 'game/isInLobby',
        getWaitingRoom: 'game/getWaitingRoom',

        isConnected: 'general/isConnected',
        isAppLoading: 'general/isLoading',
        getToken: 'general/getToken',
        getGameList: 'general/getGameList',
        getPseudo: 'general/getPseudo',
        getUrl: 'general/getUrl',
        getTrophies: 'trophy/getTrophies',
        getPlayerTrophies: 'trophy/getPlayerTrophies',
        getGameDetails: 'general/getGameDetails',
        getTmpPlayerDetails: 'general/getTmpPlayerDetails',
        getNotifications: 'notifications/getNotifications',
        getRedNotifications: 'notifications/getRedNotifications',
        getUnreadNotifications: 'notifications/getUnreadNotifications',
        getNbNotifications: 'notifications/getNbNotifications',
        getNbUnreadNotifications: 'notifications/getNbUnreadNotifications',

        getLobbyRefreshInterval: 'general/getLobbyRefreshInterval',
        getGameRefreshInterval: 'general/getGameRefreshInterval',
        getNotificationRefreshInterval: 'general/getNotificationRefreshInterval',
        getNbRefreshError: 'general/getNbRefreshError',
        getLobbyRefreshId: 'general/getLobbyRefreshId',
        getGameRefreshId: 'general/getGameRefreshId',
        getNotificationRefreshId: 'general/getNotificationRefreshId',
        getGpsId: 'general/getGpsId',
        acceptPushNotifs: 'general/acceptPushNotifs',


    })
}
