<template>
    <v-card
            class="mt-5"
            :color="getColor"
            dark
    >
        <v-card-title>
            <v-icon
                    large
                    left
            >
                {{ getStatusIcon }}
            </v-icon>
            <span class="title font-weight-light">{{ title }}</span>
        </v-card-title>

        <v-card-text class="headline font-weight-bold">
            {{ description }}
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: "Trophy",
        props : {
            title : '',
            difficulty : '',
            description : '',
            done :  false,
        },
        computed : {
            getBgColor () {
                switch (this.difficulty) {
                    case 'Facile' : return 'badge badge-success float-right';
                    case 'Moyen' : return 'badge badge-warning float-right';
                    default : return 'badge badge-danger float-right';
                }
            },
            getStatusIcon () {
                return this.done ? 'mdi-lock-open-variant' : 'mdi-lock';
            },
            getColor () {
                return this.done ? '#D4AF37' : '#C4CACE';
            }
        }
    };
</script>

<style scoped>
    .trophyDone:hover{
        background-color: rgba(0,0,0,0.5);
    }

    .baseTrophy {
        margin-top: 10px;
    }
    .trophyDone{
     padding: 10px;
    }

    .trophyUnDone {
        background-color: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
    }
    .trophyUnDone:hover {
        background-color: rgba(0,0,0,0.1);
    }
</style>
