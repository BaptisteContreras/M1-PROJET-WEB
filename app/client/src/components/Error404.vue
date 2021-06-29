<template>
    <v-container   app>
    <v-row
    align="middle"
    justify="center"
    >
        <v-col>
            <h1>404 not found...</h1>
        </v-col>
        <v-col>
            <v-btn
                    to="/"
            text >
                Retour
            </v-btn>
        </v-col>

    </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "Error404",
        mounted() {
            console.log("error")
        }
    };
</script>

<style scoped>

</style>
