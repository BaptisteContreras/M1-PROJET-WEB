<template>
    <v-container
    app
    fluid
    >
        <v-row
                align="start"
                justify="start"

        >
            <v-col cols="12">
                <trophy   v-for="trophy in getPlayerTrophyList" :title="trophy.name" :description="trophy.description" :difficulty="trophy.difficulty" :done="trophy.done" ></trophy>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import Trophy from './Includes/Trophy.vue'
    export default {
        name: "TrophyList",
        components : {
            Trophy
        },
        computed : {
            getPlayerTrophyList(){
                let toDisplay = [];
                let trophies = this.getTrophies;
                let playerTrophies = this.getPlayerTrophies;
                for (let i in trophies){
                    let current = trophies[i];
                    current["done"] = playerTrophies.filter((el) => el.id === current.id && el.done).length === 1
                    toDisplay.push(current)
                }

                return toDisplay
            }
        }
    };
</script>

<style scoped>

</style>
