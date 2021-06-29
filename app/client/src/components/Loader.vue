<template>
    <div class="custom-loader">
       <div class="spinner">
           <fulfilling-bouncing-circle-spinner
                   :animation-duration="4000"
                   :size="60"
                   :color="'#ff1d5e'"
           />
       </div>
    </div>
</template>

<script>
    import {FulfillingBouncingCircleSpinner} from 'epic-spinners'

    export default {
        name: "loader",
        components: {
            FulfillingBouncingCircleSpinner
        },
    };
</script>

<style scoped>
    .spinner {
        position: absolute;
        top: 50%;
        left: 48%;
    }
    .custom-loader {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        z-index: 2000;
        background-color: rgba(0,0,0,0.7);
    }
</style>
