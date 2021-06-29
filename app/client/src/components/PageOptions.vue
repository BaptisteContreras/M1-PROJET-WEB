<template>
    <v-container   app>
    <v-card >
        <v-card-text class="6">
            <v-form>
                <v-text-field label="Url de votre image" :placeholder="preFillUrl"  v-model="url"></v-text-field>
                <v-subheader>Temps de refresh des notifications</v-subheader>

                <v-slider
                        v-model="notification"
                        :tick-labels="notificationLabels"
                        :max="4"
                        step="1"
                        color="red"
                        ticks="always"
                        tick-size="4"
                ></v-slider>
                <v-subheader>Temps de refresh du lobby</v-subheader>

                <v-slider
                        v-model="lobby"
                        :tick-labels="lobbyLabels"
                        :max="4"
                        step="1"
                        color="orange"
                        ticks="always"
                        tick-size="4"
                ></v-slider>
                <v-subheader>Temps de refresh du jeu</v-subheader>

                <v-slider
                        v-model="game"
                        :tick-labels="gameLabels"
                        :max="4"
                        step="1"
                        ticks="always"
                        color="green"
                        tick-size="4"
                ></v-slider>
            </v-form>
        </v-card-text>


        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="updateForm" color="success">Sauvegarder</v-btn>
        </v-card-actions>
    </v-card>
    </v-container>
</template>

<script>
    export default {
        name: "PageSendImage",
        data () {
            return {
                url : '',
                notification : 0,
                lobby : 0,
                game : 0,
                lobbyLabels : [
                    '1s',
                    '2s',
                    '3s',
                    '4s',
                    '5s',
                ],
                gameLabels : [
                    '1s',
                    '2s',
                    '3s',
                    '4s',
                    '5s',
                ],
                notificationLabels : [
                    '1s',
                    '2s',
                    '3s',
                    '4s',
                    '5s',
                ]
            }
        },
        mounted() {
            this.notification = this.getNotificationStartStep()
            this.lobby = this.getLobbyStartStep()
            this.game = this.getGameStartStep()
        },
        computed : {
            preFillUrl (){
                return this.getImageUrl ? this.getImageUrl : 'Url de votre image';
            },

        },
        methods : {
            getNotificationStartStep(){
                return (this.getNotificationRefreshInterval / 1000) - 1
            },
            getLobbyStartStep(){
                return (this.getLobbyRefreshInterval / 1000) - 1
            },
            getGameStartStep(){
                return (this.getGameRefreshInterval / 1000) - 1
            },
            convertRangeValue(r){
                return (r+1) * 1000;
            },
            updateForm(){
                this.changeUrl()
                this.setGameRefreshInterval(this.convertRangeValue(this.game))
                this.setLobbyRefreshInterval(this.convertRangeValue(this.lobby))
                this.setNotificationRefreshInterval(this.convertRangeValue(this.notification))
                this.clearNotificationRefresh()
                this.setNotificationsRefresh()
            },
            changeUrl (){
                if(this.preFillUrl !== this.url && this.url !== ''){
                    this.setLoading(true)
                    this.makePutCall(
                        this.node + '/api/resources/'+this.getPseudo+'/image',
                        {url : this.url}
                    )
                    .then((resp) => {
                        this.setUrl(this.url);
                        this.$toastr.s('', "Paramètres mis à jour.")
                    })
                    .catch((e) => {
                        this.$toastr.e('', "Une erreur s'est produite.")
                    })
                    .finally(() => {
                        this.setLoading(false)
                    })

                }else{
                    this.$toastr.s('', "Paramètres mis à jour.")
                }

            }
        }
    };
</script>

<style scoped>

</style>
