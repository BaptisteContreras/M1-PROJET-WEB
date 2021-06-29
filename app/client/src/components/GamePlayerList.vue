<template>
    <v-container
    fluid
    app
    >
        <v-row
            justify="end"
        >
            <v-alert type="info">
                {{ nbPlayer }}
            </v-alert>
        </v-row>
       <v-row
               justify="start"
               align="start"
       >
           <v-card
                   v-for="player in playerList"
                   class="ml-10"
                   max-width="200"
                   tile
           >
                   <v-row
                           align="end"
                           class="fill-height"
                   >
                       <v-col
                               align-self="start"
                               class="pa-4"
                               cols="12"
                       >
                           <v-avatar
                                   class="profile"
                                   color="grey"
                                   size="190"
                                   tile
                           >
                               <v-img :src="getPlayerImage(player)"></v-img>
                           </v-avatar>
                       </v-col>
                       <v-col class="py-0">
                           <v-list-item
                           >
                               <v-list-item-content>
                                   <v-list-item-title class="title">{{ player.id }}</v-list-item-title>
                               </v-list-item-content>
                           </v-list-item>
                       </v-col>
                   </v-row>
           </v-card>
       </v-row>
        <v-row
                class="mt-5"
            justify="center"
        >
            <v-btn
            raised
            @click="backToGameList"
            color="purple"
            dark
            class="mr-5"
            >
                Retour aux parties
            </v-btn>

        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "GamePlayerList",
        mounted() {
            let game = this.$route.params.game;
            this.setLoading(true)
            this.makeGetCall(this.node+'/api/games/'+game)
                .then(d => {
                    this.setGameDetails(d.data)
                    let playersRequest = []
                    for (let i in d.data.players){
                        let player = d.data.players[i];
                            playersRequest.push(this.makeGetCall(this.node + "/api/players/" + player + "/refresh"))

                    }
                    this.axios.all(playersRequest).then(this.axios.spread((...responses) => {
                        console.log(responses)
                        let tmpP = responses.map((e) => e.data)
                        this.setTmpPlayerDetails(tmpP)
                    })).catch(errors => {
                        this.$toastr.e('', 'Impossible de récupérer la liste des joueurs pour cette partie.');
                        this.setTmpPlayerDetails([])

                    })
                })
                .catch((e) => {this.$toastr.e('', 'Impossible de récupérer la liste des joueurs pour cette partie.');console.log(e)})
                .finally(() => this.setLoading(false))
        },
        computed : {
            playerList(){
              return this.getTmpPlayerDetails;
            },
            nbPlayer(){
                let tmp =this.playerList.length + " joueur";
                return this.playerList.length > 1 ? tmp+'s' : tmp;
            }
        },
        methods : {
            getPlayerImage(player){
                return player.url ? player.url : '/pac.png';
            },

        }
    };
</script>

<style scoped>

</style>
