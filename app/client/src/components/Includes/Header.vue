<template>
    <div>
        <toolbar @toggleMenu="toggleMenu"></toolbar>
        <v-navigation-drawer
                color="blue-grey darken-3"
                dark
                app
                v-model="drawer"
        >
            <v-list
                    dense
                    nav
                    class="py-0"

            >
                <v-list-item two-line class="px-0" active-class="active">
                    <v-list-item-avatar>
                        <img :src="this.getImageUrl" alt="User Image">

                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ displayPseudo }}</v-list-item-title>
                        <v-list-item-subtitle>Connecté</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list>
                    <v-list-item
                            :to="item.route"
                            @click="changeMenuState(item.id)"
                            v-for="item in items"
                            :key="item.title"
                            link
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                    <v-list-item>
                        <v-switch
                                v-model="$vuetify.theme.dark"
                                hide-details
                                inset
                                :label="$vuetify.theme.dark ? 'Dark mode' : 'Light mode'"
                        ></v-switch>
                    </v-list-item>
                </v-list>

            </v-list>


        </v-navigation-drawer>

    </div>
</template>

<script>
    import Toolbar from '../../components/Includes/Toolbar.vue';

    export default {
        name: "Header",
        components: {
            Toolbar
        },
        data() {
            return {
                drawer: false,
                items: [
                    {
                        id: 'Games',
                        icon: 'mdi-gamepad-variant',
                        title: 'Liste des parties',
                        route: '#/games',
                        status: this.$route.name === 'Games'
                    },
                    {id: 'Trophy', icon: 'mdi-trophy',route: '#/trophy', title: 'Trophés', status: this.$route.name === 'Trophy'},
                    {
                        id: 'Options',
                        icon: 'mdi-cog-clockwise',
                        title: 'Options',
                        route: '#/options',
                        status: this.$route.name === 'Options'
                    },
                ],
            };
        },
        computed: {
            displayPseudo() {
                return this.getPseudo;
            },
        },
        methods: {
            changeMenuState(el) {
                for (let key in this.items) {
                    let current = this.items[key];
                    current.status = current.id === el;
                }
                this.$router.push({name: el});


            },

            displayMenuState(el) {
                return this.menu[el] ? 'nav-link active' : 'nav-link';
            },
            toggleMenu() {
                console.log("toogled");
                this.drawer = !this.drawer;
            }
        }
    };

</script>

<style scoped>

</style>
