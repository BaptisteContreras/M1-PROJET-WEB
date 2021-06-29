<template>
    <v-container fluid app>

        <v-row
                align="end"
                justify="end"
        >
            <v-btn @click="quitLobby" dark color="red">Quitter le lobby</v-btn>
        </v-row>
        <v-row class="mt-5"
               align="start"
               justify="space-around"
        >


        </v-row>
        <v-row align="start"
               justify="start" class="mt-5">
            <playMap></playMap>
        </v-row>
        <v-row class="mt-5 d-none d-lg-flex"
               align="start"
               justify="space-around"

        >


            <v-card v-if="this.isInGame">
                <v-card-title>
                    <p>Nombre de cible atteinte :</p>
                </v-card-title>
                <v-card-text>
                    <p> {{ getNbOwnedTarget }}</p>
                    <v-chip
                            v-for="target in getOwnedTarget"
                            color="green"
                            dark
                    >

                        {{ target.name }}
                    </v-chip>

                </v-card-text>
            </v-card>
            <v-card v-if="this.isInGame">
                <v-card-title>
                    <p>Temps restant :</p>
                </v-card-title>
                <v-card-text>
                    <v-chip
                            :color="getTimeColor"
                            dark
                    >
                        {{ getRemaningTime }} s

                    </v-chip>
                </v-card-text>
            </v-card>
            <v-card v-if="this.isInGame">
                <v-card-title>
                    <p>Leader actuelle :</p>
                </v-card-title>
                <v-card-text>
                    <p> {{ getLeader.name }} avec {{ getLeader.nb }} cible{{ getLeader.nb > 1 ? 's' : ''}} </p>
                </v-card-text>
            </v-card>

            <v-card>
                <v-card-title>
                    <p>Joueur(s) dans le salon :</p>
                </v-card-title>
                <v-card-text>
                    <p> {{ getNbPlayerWaiting }}</p>
                </v-card-text>
            </v-card>
            <v-card>
                <v-card-title>
                    <p>Status de la partie :</p>
                </v-card-title>
                <v-card-text>
                    <v-chip
                            :color="getChipColor"
                            dark
                    >
                        {{ getChipText }}
                    </v-chip>
                </v-card-text>
            </v-card>
            <v-card>
                <v-card-title>
                    <p>Manche actuelle :</p>
                </v-card-title>
                <v-card-text>
                    <p> {{ getManche }} </p>
                </v-card-text>
            </v-card>
        </v-row>

        <v-row class="mt-5 d-lg-none"

        >
            <v-expansion-panels
                    popout
                    multiple
            >

                <v-expansion-panel v-if="this.isInGame">
                    <v-expansion-panel-header>Nombre de cible atteinte :</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <p> {{ getNbOwnedTarget }}</p>
                        <v-chip
                                v-for="target in getOwnedTarget"
                                color="green"
                                dark
                        >

                            {{ target.name }}
                        </v-chip>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel v-if="this.isInGame">
                    <v-expansion-panel-header>Temps restant :</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-chip
                                :color="getTimeColor"
                                dark
                        >
                            {{ getRemaningTime }} s

                        </v-chip>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel v-if="this.isInGame">
                    <v-expansion-panel-header>Leader actuelle :</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        {{ getLeader.name }} avec {{ getLeader.nb }} cible{{ getLeader.nb > 1 ? 's' : ''}}
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                    <v-expansion-panel-header>Joueur(s) dans le salon :</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        {{ getNbPlayerWaiting }}
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                    <v-expansion-panel-header>Status de la partie :</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-chip
                                :color="getChipColor"
                                dark
                        >
                            {{ getChipText }}
                        </v-chip>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                    <v-expansion-panel-header>Manche actuelle :</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        {{ getManche }}
                    </v-expansion-panel-content>
                </v-expansion-panel>

            </v-expansion-panels>
        </v-row>

        <modals-winner></modals-winner>

    </v-container>
</template>

<script>
    import PlayMap from './Map.vue';
    import ModalsWinner from './ModalsWinner.vue';

    export default {
        name: "GamePage",
        components: {
            PlayMap,
            ModalsWinner
        },
        destroyed() {
          this.quitLobby(false)
        },
        methods: {
            quitLobby(onclick=true) {
                this.clearAllBackgroundTask();
                this.makePostCall("/api/players/" + this.getPseudo + "/leaveAll").then((d) => {
                    console.log("Vous avez quitté votre partie actuelle.");
                    this.$toastr.s("Vous avez quitté votre partie actuelle.");

                });

                if(onclick){
                    this.$router.push({name: "Games"});
                }
            },


        },
        computed: {
            getNbOwnedTarget() {
                if (!this.getResources || !this.getPlayerStatus) return "Loading...";
                let p = this.getPlayerStatus;
                return p.owned.length + " / " + this.getResources.manche.targets.length;
            },
            getOwnedTarget() {
                if (!this.getResources || !this.getPlayerStatus) return "Loading...";
                return this.getPlayerStatus.owned.map(o => this.getTargetById(o));
            },

        },
        mounted() {
            this.clearAllBackgroundTask();
            this.makePostCall(this.node + "/api/games/" + this.$route.params.game + "/can", {
                player: this.getPseudo,
                action: "play"
            })
                .then((e) => {
                    console.log("Player can play the game.. init playscreen... ");
                    this.makePostCall(this.node + "/api/games/" + this.$route.params.game + "/initPlayer", {
                        player: this.getPseudo,
                        media: "playscreen"
                    })
                        .then((d) => {
                            console.log("The playscreen has been initialized... good game !");
                            this.setCurrentGame(d.data);
                            this.setLobbyRefresh();
                            if (this.isGameRunning) {
                                this.clearLobbyRefresh();
                                this.setGameRefresh();
                                this.setGpsWatcher();
                            }
                            this.$toastr.s("Vous êtes dans la salle d'attente, la partie commencera quand tout les joueurs seront là ! Vous serrez avertis quand la partie commencera.");
                        })
                        .catch((e) => {
                            console.log(e);
                            this.$toastr.e('Une erreur s\'est produite durant l\'initialisation de la partie... Veuillez recharger la page');
                        });
                })
                .catch((e) => {
                    console.log(e);
                    this.$toastr.e('Vous ne pouvez pas jouer à cette partie.');
                    this.$router.push({name: 'Index'});
                });
        },

    };
</script>

<style scoped>

</style>
