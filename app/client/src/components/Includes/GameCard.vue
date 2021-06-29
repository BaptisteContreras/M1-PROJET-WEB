<template>

       <v-card


       >

           <v-img
                   class="white--text align-end"
                   height="200px"
                   width="100%"
                   :src="this.getStatusIcon"
           >
               <v-card-title>{{ name }}</v-card-title>
           </v-img>

           <v-card-subtitle class="pb-0">{{ getStatusLabel }}</v-card-subtitle>

           <v-card-text class="text--primary">
               <div><b>{{ name }}</b></div>
           </v-card-text>

           <v-card-actions>
               <v-row>
                   <v-col
                           cols="12"
                           md="3"
                           v-if="join && !current"
                   >
                       <v-btn
                               @click="joinGame"
                               color="green"
                               text
                       >
                           Rejoindre
                       </v-btn>

                   </v-col>
                   <v-col
                           cols="12"
                           md="3"
                           v-if="current && status === 'waiting' "
                   >

                       <v-btn
                               @click="leaveGame"
                               color="red"
                               text
                       >
                           Quitter
                       </v-btn>

                   </v-col>
                   <v-col
                           cols="12"
                           md="4"
                   >
                       <v-btn
                               @click="goPlayerList"
                               color="blue"
                               text
                       >
                           Voir la liste des joueurs
                       </v-btn>

                   </v-col>
                   <v-col
                           cols="12"
                           md="3"
                           v-if="current && status !== 'stop' "
                   >
                       <v-btn
                                @click="goPlayGame"
                               color="green"
                               text
                       >
                           Jouer
                       </v-btn>

                   </v-col>
                   <v-col
                           cols="12"
                           md="4"
                           v-if="!current && status !== 'stop' "
                   >
                       <v-btn
                               @click="goSpectateGame"
                               color="blue"
                               text
                       >
                           Mode spectateur
                       </v-btn>

                   </v-col>
                   <v-col
                           cols="12"
                           md="4"
                           v-if="status === 'stop' "
                   >


                       <v-btn

                               color="blue"
                               text
                               @click="goResults"
                       >
                           Afficher les résultats
                       </v-btn>

                   </v-col>

               </v-row>




           </v-card-actions>
       </v-card>
</template>

<script>
    export default {
        name: "GameCard",
        props: {
            name: '',
            status: '',
            current: false,
            join: false

        },
        computed: {
            getStatusLabel() {
                switch (this.status) {
                    case 'waiting':
                        return 'En attente';
                    case 'stop':
                        return 'Terminée';
                    default:
                        return "En cours";
                }
            },
            getStatusIcon() {

                switch (this.status) {
                    case 'waiting':
                        return '/public/img/waiting.jpeg';
                    case 'stop':
                        return '/public/img/finished.png';
                    default:
                        return "/public/img/gamepad.jpg";
                }
            },
            getBgStatus() {

                switch (this.status) {
                    case 'waiting':
                        return 'info-box-icon bg-info elevation-1';
                    case 'stop':
                        return 'info-box-icon bg-danger elevation-1';
                    default:
                        return "info-box-icon bg-success elevation-1";
                }
            }
        },
        methods: {
            goPlayGame(){
                this.$router.push({name: 'Play', params: {game: this.name}});
            },
            goResults(){
                this.$router.push({name: 'Results', params: {game: this.name}});
            },
            goPlayerList() {
                this.$router.push({name: 'GamePlayerList', params: {game: this.name}});
            },
            goSpectateGame() {
                this.$router.push({name: 'Spectate', params: {game: this.name}});
            },
            joinGame() {
                this.makePostCall(this.node + "/api/games/" + this.name + "/join", {player: this.getPseudo})
                    .then((d) => this.$toastr.s('', 'Vous avez rejoins la partie.'))
                    .catch((e) => this.$toastr.e('', 'Impossible de rejoindre la partie'))
                    .finally(() => this.refreshGames())
            },
            leaveGame() {
                this.makePostCall(this.node + "/api/games/" + this.name + "/leave", {player: this.getPseudo})
                    .then((d) => this.$toastr.s('', 'Vous avez quitté la partie.'))
                    .catch((e) => this.$toastr.e('', 'Impossible de quitté la partie'))
                    .finally(() => this.refreshGames())
            },

        }
    };
</script>

<style scoped>

</style>
