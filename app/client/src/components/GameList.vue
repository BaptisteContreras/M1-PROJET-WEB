<template>
    <v-container fluid app>
        <v-row
                v-for="game in getCardList"
                class="mb-5"
                justify="start"
        >
            <v-col
                    cols="12"
            >
                <GameCard :name="game.name" :join="game.canBeJoined" :current="game.isActiveGame"
                          :status="game.status"></GameCard>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
    import GameCard from "./Includes/GameCard.vue";

    export default {
        name: "GameList",
        components: {
            GameCard
        },
        mounted() {
            this.refreshGames();
        },
        computed: {
            getCardList() {
                return this.getGameList;
            }

        }
    };
</script>

<style scoped>

</style>
