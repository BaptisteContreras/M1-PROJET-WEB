<template>
    <v-container fluid   app>

        <v-row
                align="end"
                justify="end"
        >
            <v-btn @click="quitLobby" dark color="red" >Quitter le mode spectateur</v-btn>
        </v-row>
        <v-row class="mt-5"
               align="start"
               justify="space-around"
        >



        </v-row>
        <v-row  align="start"
                justify="start" class="mt-5">
            <playMap></playMap>
        </v-row>
        <v-row class="mt-5 d-none d-lg-flex"
               align="start"
               justify="space-around"

        >
            <v-card  v-if="this.isInGame" >
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
            <v-card  v-if="this.isInGame" >
                <v-card-title>
                    <p>Leader actuelle :</p>
                </v-card-title>
                <v-card-text>
                    <p> {{ getLeader.name }} avec {{ getLeader.nb }} cible{{ getLeader.nb > 1 ? 's' : ''}} </p>
                </v-card-text>
            </v-card>

            <v-card >
                <v-card-title>
                    <p>Joueur(s) dans le salon :</p>
                </v-card-title>
                <v-card-text>
                    <p> {{ getNbPlayerWaiting }}</p>
                </v-card-text>
            </v-card>
            <v-card >
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
    import PlayMap from './Map.vue'
    import ModalsWinner from './ModalsWinner.vue';

    export default {
        name: "SpectatePage",
        components : {
            PlayMap,
            ModalsWinner
        },
        destroyed() {
            this.quitLobby(false)
        },
        methods : {
            quitLobby(onclick = true){
                this.clearAllBackgroundTask()
                if(onclick){
                    this.$router.push({name: "Games"});
                }
                this.$toastr.s("Vous avez quitté le mode spectateur.")
            },
        },
        mounted() {
            this.clearAllBackgroundTask()
            this.makePostCall(this.node + "/api/games/" + this.$route.params.game + "/can", {
                player: this.getPseudo,
                action: "spectate"
            })
                .then((e) => {
                    console.log("Player can spec the game.. init playscreen... ");
                    this.makePostCall(this.node + "/api/games/" + this.$route.params.game + "/initPlayer", {
                        player: this.getPseudo,
                        media: "specscreen"
                    })
                        .then((d) => {
                            console.log("The specscreen has been initialized... good game !");
                            this.setCurrentGame(d.data);
                            this.setLobbyRefresh();
                            if (this.isGameRunning){
                                this.clearLobbyRefresh();
                                this.setGameRefresh()
                            }
                            this.$toastr.s("La partie est en attente.");
                        })
                        .catch((e) => {
                            console.log(e);
                            this.$toastr.e('Une erreur s\'est produite durant l\'initialisation de la partie... Veuillez recharger la page');
                        });
                })
                .catch((e) => {
                    console.log(e);
                    this.$toastr.e('Vous ne pouvez pas regarder cette partie.');
                    this.$router.push({name: 'Index'});
                });
        }
    };
</script>

<style scoped>

</style>
