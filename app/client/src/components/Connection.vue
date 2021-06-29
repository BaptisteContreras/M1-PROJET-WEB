<template>
    <v-container

            fluid
            fill-height
    >
        <v-layout
                align-center
                justify-center
        >
            <v-flex
                    xs12
                    sm8
                    md4
            >
                <v-card class="elevation-12">
                    <v-toolbar
                            color="primary"
                            dark
                            flat
                    >
                       <v-row align="center" justify="center">
                           <v-col>
                               <atom-spinner
                                       :animation-duration="1000"
                                       :size="60"
                                       :color="'#ff1d5e'"
                               />
                           </v-col>
                           <v-col>
                               <v-toolbar-title>PacMApp</v-toolbar-title>
                           </v-col>
                            <v-col>
                                <atom-spinner
                                        :animation-duration="1000"
                                        :size="60"
                                        :color="'#ff1d5e'"
                                />
                            </v-col>

                       </v-row>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                    label="Login"
                                    name="login"
                                    prepend-icon="mdi-login"
                                    type="text"
                                    v-model="login"
                            ></v-text-field>

                            <v-text-field
                                    id="password"
                                    label="Password"
                                    name="password"
                                    v-model="password"
                                    prepend-icon="mdi-lock"
                                    type="password"
                            ></v-text-field>
                            <v-checkbox v-model="remember" label="Se souvenir de moi"></v-checkbox>

                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="authenticate" color="primary">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {AtomSpinner} from 'epic-spinners'

    export default {
        name: "Connection",
        components: {
            AtomSpinner
        },
        data() {
            return {
                login: null,
                password: null,
                remember : false
            }
        },
        mounted() {
            if (this.isConnected){
                this.$router.push({name : 'Index'})
            }
        },
        methods: {
            authenticate() {
                this.setLoading(true);
                let data = new FormData()
                data.set('login', this.login)
                data.set('password', this.password)
                let _this = this
                this.axios.post(
                    this.spring + '/login',
                    data,
                   {
                        'Content-Type': 'multipart/form-data'
                    }
                    )
                    .then((response) => {
                        _this.setConnected(true);
                        _this.setPseudo(_this.login);
                        _this.setToken(response.headers.authentication);
                        _this.$router.push({name : 'Index'});
                        _this.$toastr.s("", "Vous êtes connecté !");
                        this.setNotificationsRefresh()
                        this.setBrowserNotification()
                        this.refreshUser(false);
                        if (_this.remember){
                            localStorage.setItem('token', response.headers.authentication);
                            localStorage.setItem('pseudo', _this.login);
                        }else{
                            localStorage.removeItem('token');
                            localStorage.removeItem('pseudo') ;
                        }
                    })
                    .catch((error) => {
                        _this.$toastr.e("", "La tentative de connexion a échouée.");

                    })
                    .finally((_) => {
                        this.setLoading(false)
                    })
                ;

            }
        }
    }
</script>

<style scoped>

</style>
