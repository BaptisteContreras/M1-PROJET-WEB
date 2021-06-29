<template>
    <v-container
    app
    fluid
    >
        <v-row
            justify="start"
        >
            <v-col cols="4">

            </v-col>
            <v-col lg="4" sm="12" md="12">
                <v-simple-table>
                    <thead>
                    <tr>
                        <th class="text-left">#</th>
                        <th class="text-left">Joueur</th>
                        <th class="text-left">Manche gagné(s)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, i) in getLadder" >
                        <td>
                            <v-icon v-if="getLadderTrophy(i) != false" :color="getLadderTrophy(i)" >mdi-trophy</v-icon>
                            <span v-else>{{ i+1 }}.</span>
                        </td>
                        <td>{{ item.id }}</td>
                        <td>{{ item.nb }}</td>
                    </tr>
                    </tbody>
                </v-simple-table>

            </v-col>
            <v-col cols="4">

            </v-col>
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
        name: "Results",
        mounted() {
            this.getGameScores(this.$route.params.game)
        },
        methods : {
            getLadderTrophy(i){
                switch (i) {
                    case 0 : return '#D4AF37';
                    case 1 : return '#AAA9AD';
                    case 2 : return '#b87333';
                    default: return false;
                }
            }
        }
    };
</script>

<style scoped>

</style>
