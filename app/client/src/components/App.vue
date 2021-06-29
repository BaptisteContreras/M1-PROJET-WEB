<template>
    <div>
        <v-app id="inspire">
            <router-view name="Header"></router-view>

            <v-content>
                <router-view v-if="!isFull"></router-view>
                <router-view v-else name="full"></router-view>
            </v-content>

            <v-footer app>

            </v-footer>
        </v-app>
        <transition name="fade">
            <loader v-if="loading"></loader>
        </transition>


    </div>
</template>

<script>
    import Loader from "../components/Loader.vue";

    export default {
        name: 'PacMApp',
        computed: {
            loading() {
                return this.isAppLoading;
            },
            isFull() {
                return this.$route.meta.full;
            }
        },
        mounted() {
            if (this.isConnected) {
                this.refreshUser();
                this.setNotificationsRefresh();
                this.setBrowserNotification();
            }
            this.refreshTrophies(true);
            this.initServiceWorker();
            this.initLightSensor();

        },
        components: {
            Loader
        }

    };
</script>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }
</style>
