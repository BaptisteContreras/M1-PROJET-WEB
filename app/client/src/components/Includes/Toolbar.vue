<template>
    <v-app-bar
            color="cyan darken-1"
            dense
            app
            dark
    >
        <v-app-bar-nav-icon @click="tmenu"></v-app-bar-nav-icon>

        <v-toolbar-title>PacMApp</v-toolbar-title>

        <v-spacer></v-spacer>


        <v-menu
                transition="slide-y-transition"
                bottom
                :close-on-content-click="false"

        >
            <template v-slot:activator="{ on }" >
                <v-btn icon v-on="on">
                    <v-badge
                            :content="getNbNotif()"
                            :value="getNbNotif()"
                            color="green"
                            overlap
                    >
                        <v-icon >mdi-bell</v-icon>
                    </v-badge>

                </v-btn>
            </template>
            <v-list>
                <v-list-item
                        v-for="(notif, i) in getUnreads()"
                >
                    <v-list-item-avatar>
                        <v-icon  :color="getDisplayColor(notif)" >{{ getDisplayIcon(notif) }}</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ getDisplayNotif(notif) }}</v-list-item-title>
                        <v-list-item-subtitle>{{ notif.type }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                        <v-btn

                                icon
                                @click="markAsRead(notif.id)"
                        >
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-menu>



        <v-icon v-if="this.isInGame">mdi-heart</v-icon>
        <v-icon v-if="this.isInLobby">mdi-watch</v-icon>
        <v-btn icon @click="this.logout">
            <v-icon>mdi-logout</v-icon>
        </v-btn>

    </v-app-bar>
</template>

<script>
    export default {
        name: "Toolbar",
        methods : {
            tmenu(){
                this.$emit('toggleMenu')
            },
            getDisplayNotif(notif){
                if (notif.type === 'unlock'){
                    return notif.data.name
                }else {
                    return notif.data
                }
            },
            getDisplayIcon(notif){
                if (notif.type === 'unlock'){
                    return 'mdi-trophy'
                }else {
                    return 'mdi-gamepad-variant'
                }
            },
            getDisplayColor(notif){
                if (notif.type === 'unlock'){
                    return '#D4AF37'
                }else {
                    return 'green'
                }
            },
            getNbNotif(){
                return this.getNbUnreadNotifications
            },
            getUnreads(){
                return this.getUnreadNotifications
            },
            markAsRead(n){
               this.readNotif(n)
            }
        }
    };
</script>

<style scoped>

</style>
