import {mapActions} from 'vuex';

export default {

    // Sensor
    initLightSensor() {
        if ( 'AmbientLightSensor' in window ) {
            const sensor = new AmbientLightSensor();
            sensor.onreading = () => {
                let luminosity = sensor.value;
                console.log("[LIGHT] : changed " + luminosity)

                let state = '';
                // Evaluating the luminosity
                if (luminosity <= 50){
                    state = 'dark'
                }else{
                    state = state > 10000 ? 'bright' : 'normal';
                }

                // Apply the good treatment
                this.$vuetify.theme.dark = 'dark' === state;
            };
            sensor.onerror = (event) => {
                console.log(event.error.name, event.error.message);
            };
            sensor.start();
            this.$toastr.s("Le capteur de luminosité est activé");
        }else{
            this.$toastr.e("Le capteur de luminosité n'est pas dispo");
        }
    },
    // HTTP
    makeGetCall(url) {
        return this.axios.get(url, {
            headers: {
                'Authentication': this.getToken,
                'PLogin': this.getPseudo
            }
        });
    },
    makePostCall(url, data) {
        return this.axios.post(url, data, {
            headers: {
                'Authentication': this.getToken,
                'PLogin': this.getPseudo,
                "Content-Type": "application/json"
            }
        });
    },
    makePutCall(url, data) {
        return this.axios.put(url, data, {
            headers: {
                'Authentication': this.getToken,
                'PLogin': this.getPseudo,
                "Content-Type": "application/json"
            }
        });
    },


    // BACKGROUND TASK SETTER

    setBrowserNotification(){
        let _this = this;
        Notification.requestPermission().then(function(result) {
            if(result === 'granted') {
                _this.setAcceptPushNotifs(true)
            }
        });
    },

    setNotificationsRefresh() {
        this.clearNotificationRefresh();
        this.setNotificationRefreshId(setInterval(this.refreshNotifications, this.getNotificationRefreshInterval));
    },
    setGameRefresh(spectate = false) {
        this.clearGameRefresh();
        this.setInGame(true);
        let gameRefreshId = setInterval(() => {
            this.refreshGame(spectate);
        }, this.getGameRefreshInterval);
        this.setGameRefreshId(gameRefreshId)
    },
    setGpsWatcher() {
        if (!"geolocation" in navigator) {
            this.$toastr.e('Le GPS n\'est pas disponible sur votre device');
            return false;
        }
        this.clearGps();
        let gpsId = navigator.geolocation.watchPosition((position) => {
            console.log(position.coords.latitude + " / " + position.coords.longitude);
            this.setPlayerPos([position.coords.latitude, position.coords.longitude])
            this.makePutCall(this.node + "/api/resources/" + this.getPseudo + "/position",
                [position.coords.latitude, position.coords.longitude]
            )
                .catch((e) => {
                    console.log(e);
                    this.$toastr.e('La synchronisation GPS -> serveur a echouée');
                });
        }, (e) => {
            console.log(e);
            this.$toastr.e('Erreur GPS');
        });

        this.setGpsId(gpsId)

        return true;
    },
    setLobbyRefresh() {
        this.clearLobbyRefresh();
        this.setInLobby(true);
        this.setLobbyRefreshId(setInterval(this.refreshLobby, this.getLobbyRefreshInterval));
    },

    // REFRESH
    refreshLobby() {
        this.makeGetCall(this.node + "/api/games/" + this.getCurrentGame.id + "/lobby/refresh")
            .then((d) => {
                this.setCurrentGame(d.data);
                if (this.isGameRunning) {
                    this.clearLobbyRefresh();
                    this.setGameRefresh();
                    this.setGpsWatcher();

                }
            })
            .catch((e) => {
                console.log(e);
                this.checkAuthError(e)
                this.$toastr.e('La synchronisation du lobby a échouée...');
            });
    },
    sendBrowserNotification(title, body, image = null){
        let options = {
            body,
        }
        if (image){
            options['icon'] = image
        }
        new Notification(title, options);
    },
    displayGameBrowserNotif(d){
        d.filter((n) => n.type === 'game').forEach((n) => {
            this.sendBrowserNotification("PacMApp : notification de partie", n.data)
        })
    },
    refreshNotifications(){
        console.log("refresh notifications")
        this.makeGetCall(this.node + "/api/players/"+this.getPseudo+"/notifications")
            .then((d) => {
                this.pushNotifications({d : d.data, _this : this})
                if (this.acceptPushNotifs){
                    this.displayGameBrowserNotif(d.data)
                }
            })
            .catch((e) => {
                this.checkAuthError(e)
                console.log(e)
                this.$toastr.e('Une erreur est survenu durant la synchronisation des notifications...')
            })
    },
    refreshGame(spectate = false) {
        console.log("refresh game");
        this.makeGetCall(this.node + "/api/games/" + this.getCurrentGame.id + "/refresh")
            .then((d) => {
                let data = d.data;
                if (data.status !== "active") {
                    // partie stop ou manche finie
                    this.setResources(null);
                    this.clearGameRefresh();
                    this.clearGps();
                    window.navigator.vibrate(300)
                    if (data.status === "stop") {
                        this.refreshLobby();
                        this.$toastr.s("La partie est finie...");
                        if (d.data.state === "fail"){
                            this.$toastr.e('Vous avez perdu la partie solo.')
                        }else{
                            this.getGameScores(this.getCurrentGame.id, this.getCurrentManche);
                        }

                    } else {
                        this.setLobbyRefresh();
                        this.getGameScores(this.getCurrentGame.id, this.getCurrentManche);
                        this.$toastr.s("La manche est terminée, en attente de la prochaine...");
                    }
                } else {
                    let old = this.getPlayerStatus;
                    this.setResources(data);

                    if (old && !spectate) {
                        this.notifyNewTargetOwned(old, this.getPlayerStatus);
                    }
                }
            })
            .catch((e) => {
                console.log(e);
                this.checkAuthError(e)
                this.$toastr.e('Erreur s\'est produite... la carte n\'est plus synchronisée.');
                if (this.increaseRefreshError()) {
                    this.clearGameRefresh();
                    this.nbRefreshError = 0;
                    this.$router.push({name: "Games"});
                    this.$toastr.e('En raison d\'un trop grand nombre d\'erreur, vous avez été deconnecté.');
                    this.makePostCall("/api/players/" + this.getCurrentGame.id + "/leaveAll");
                }
            });
    },
    refreshGames() {
        this.makeGetCall(this.node + "/api/games")
            .then((d) => {
                this.setGameList(d.data);
            })
            .catch((e) => {
                this.checkAuthError(e)
                this.$toastr.e('', 'Impossible de récupéré la liste des parties');
            });
    },
    refreshUser(load = true) {
        if (load) this.setLoading(true);

        this.makeGetCall(this.node + "/api/players/" + this.getPseudo + "/refresh")
            .then((resp) => {
                let data = resp.data;
                localStorage.setItem('tmpPlayer', this.getPseudo);
                this.setUrl(data.url);
                this.setPlayerTrophies(data.trophy);
            })
            .catch((e) => {
                console.log(e)
                this.checkAuthError(e)
                this.$toastr.e('', "Impossible d'actualiser vos données auprès du serveur.");
            })
            .finally(() => {
                if (load) this.setLoading(false);
            });
    },
    refreshTrophies(load = true) {
        if (load) this.setLoading(true);
        this.makeGetCall(this.node + "/api/trophies")
            .then((resp) => {
                let data = resp.data;
                this.setTrophies(data);
            })
            .catch((e) => {
                this.checkAuthError(e)
                this.$toastr.e('', "Impossible d'actualiser les trophés.");
            })
            .finally(() => {
                if (load) this.setLoading(false);
            });
    },
   // CLEAR
    clearAllBackgroundTask() {
        this.clearLobbyRefresh();
        this.clearGameRefresh();
        this.clearGps();
    },
    clearGameRefresh() {
        if (this.getGameRefreshId) {
            clearInterval(this.getGameRefreshId);
            this.setGameRefreshId(null);
        }
        this.setInGame(false);
    },
    clearLobbyRefresh() {

        if (this.getLobbyRefreshId) {
            clearInterval(this.getLobbyRefreshId);
            this.setLobbyRefreshId(null);
        }
        this.setInLobby(false);
    },
    clearNotificationRefresh() {
        if (this.getNotificationRefreshId) {
            clearInterval(this.getNotificationRefreshId);
            this.setNotificationRefreshId(null);
        }
    },
    clearGps() {
        if (this.getGpsId) {
            navigator.geolocation.clearWatch(this.getGpsId);
            this.setGpsId(null);
        }
    },

    checkAuthError(error){
        if (error.response.status === 401){
            this.logout()
            this.$toastr.e('Merci de vous reconnecter')
        }
    },



    // OTHERS

    notifyNewTargetOwned(old, newData) {
        if (!old) return false;
        newData.owned.map(d => {
            if (!old.owned.includes(d)) {
                this.$toastr.s("Vous avez capturé la cible : " + this.getTargetById(d).name);
            }
        });
    },
    getGameScores(game, manche = '') {
        this.makeGetCall(this.node + "/api/games/" + game + "/scores/" + manche)
            .then(d => {
                this.setScores(d.data.scores);
                if (manche) {
                    if (d.data.scores[0].winner === this.getPseudo) {
                        this.$toastr.s("Bravo !  vous avez gagné la manche !");
                        this.setMancheWinner(d.data.scores[0].winner)
                        // TODO faire vibrer
                    } else {
                        this.$toastr.s(d.data.scores[0].winner + " a gagné la manche");
                        this.setMancheWinner(d.data.scores[0].winner)
                    }
                    if (d.data.gwinner) {
                        this.setWinner(d.data.gwinner);
                        this.$toastr.s(d.data.gwinner + " a gagné la partie");
                    }
                } else {
                    this.setWinner(d.data.gwinner);
                    this.setLadder(d.data.final);
                }

            })
            .catch(e => {
                this.checkAuthError(e)
                this.$toastr.e("Erreur durant la récupération des scores.");
            });
    },
    getTrophy(id) {
        return this.getTrophies.filter((el) => el.id === id);
    },
    getTargetById(id) {
        if (!this.getResources) return '';
        return this.getResources.manche.targets.filter(t => t.id == id)[0];
    },
    logout() {
        this.setConnected(false);
        this.setPseudo(null);
        this.setToken(null);
        this.clearNotificationRefresh()
        this.clearAllBackgroundTask();
        localStorage.removeItem('token');
        localStorage.removeItem('pseudo');
        location.reload();
    },
    getScoreFor(manche) {
        return this.getScores.filter((s) => s.manche == manche)[0];
    },
    backToGameList() {
        this.$router.push({name: 'Games'});
    },
    increaseRefreshError() {
        this.incrementeNbRefreshError()
        return this.getNbRefreshError > this.maxRefreshError;
    },

    // ACTIONS
    ...mapActions({
        setTest: 'achievement/setTest',
        setCurrentGame: 'game/setCurrentGame',
        setInLobby: 'game/setInLobby',
        setInGame: 'game/setInGame',
        setScores: 'results/setScores',
        setWinner: 'results/setWinner',
        setLadder: 'results/setLadder',
        setResultGame: 'results/setGame',
        setResources: 'game/setResources',
        setPlayerPos: 'game/setPlayerPos',
        setMancheWinner: 'results/setMancheWinner',
        setConnected: 'general/setConnected',
        setToken: 'general/setToken',
        setLoading: 'general/setLoading',
        setPseudo: 'general/setPseudo',
        setUrl: 'general/setUrl',
        setTrophies: 'trophy/setTrophies',
        unLockTrophy: 'trophy/unLockTrophy',
        setPlayerTrophies: 'trophy/setPlayerTrophies',
        setGameList: 'general/setGameList',
        setGameDetails: 'general/setGameDetails',
        setTmpPlayerDetails: 'general/setTmpPlayerDetails',
        setNotifications: 'notifications/setNotifications',
        resetNotifications: 'notifications/resetNotifications',
        pushNotifications: 'notifications/pushNotifications',
        pushNotification: 'notifications/pushNotification',
        readNotif: 'notifications/readNotif',
        setLobbyRefreshInterval: 'general/setLobbyRefreshInterval',
        setGameRefreshInterval: 'general/setGameRefreshInterval',
        setNotificationRefreshInterval: 'general/setNotificationRefreshInterval',
        resetNbRefreshError: 'general/resetNbRefreshError',
        incrementeNbRefreshError: 'general/incrementeNbRefreshError',
        setLobbyRefreshId: 'general/setLobbyRefreshId',
        setGameRefreshId: 'general/setGameRefreshId',
        setNotificationRefreshId: 'general/setNotificationRefreshId',
        setGpsId: 'general/setGpsId',
        setAcceptPushNotifs: 'general/setAcceptPushNotifs',

    })
};
