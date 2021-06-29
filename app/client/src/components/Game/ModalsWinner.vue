<template>
    <div>
        <v-dialog
                v-model="candisplayMancheWinner"
                width="500"
                persistent
        >

            <v-card>
                <v-card-title
                        class="headline grey lighten-2"
                        primary-title
                >
                    {{ displayMancheWinner }}

                </v-card-title>

                <v-card-text>
                    La manche est terminée...

                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="primary"
                            text
                            @click="closeMancheDialog"
                    >
                        OK c'est noté !
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
                v-model="candisplayGameWinner"
                width="500"
                persistent
        >

            <v-card>
                <v-card-title
                        class="headline grey lighten-2"
                        primary-title
                >
                    {{ displayGameWinner }}

                </v-card-title>

                <v-card-text>
                    La partie est terminée...

                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="primary"
                            text
                            @click="closeGameDialog"
                    >
                        Ok cool !
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "ModalsWinner",
        data: () => {
            return {
                displayDialog: false
            };
        },
        methods : {
            closeMancheDialog() {
                this.setMancheWinner(null);
                this.displayDialog = true
            },
            closeGameDialog() {
                this.setWinner(null);
            }
        },
        computed : {
            candisplayMancheWinner() {
                let can = this.getMancheWinner !== null;
                if (can){
                    this.displayDialog = false;
                }
                return can;
            },
            candisplayGameWinner() {
                return this.getWinner !== null && this.displayDialog;
            },
            displayMancheWinner() {
                let mWinner = this.getMancheWinner;
                return mWinner === this.getPseudo ? 'Woooooow, tu as gagné la manche !' : mWinner + ' remporte la manche ! Bravo';
            },
            displayGameWinner() {
                let gWinner = this.getWinner;
                return gWinner === this.getPseudo ? 'Cette partie... elle est pour toi ! Trop fort' : gWinner + ' remporte la partie ! Relance directement une partie pour prendre ta revanche';
            },
        }
    };
</script>

<style scoped>

</style>
