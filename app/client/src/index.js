import Vue from 'vue';
import App from './components/App.vue';
import router from './router';
import store from './stores';
import globalMixins from './mixins/globalMixins';
import VueToastr from "vue-toastr";
import vuetify from "./vuetify/index";


Vue.use(VueToastr, {});
Vue.mixin(globalMixins);


window.app = new Vue({
    el: '#app',
    router,
    store,
    vuetify,
    mounted() {
        let _this = this;
        window.addEventListener('beforeunload', () => {
            return;
            console.log("App is closed...");
            const headers = {
                type: "application/json"
            };
            let blob = new Blob([
                JSON.stringify({
                    headers: {
                        'Authentication': _this.getToken,
                        'PLogin': _this.getPseudo,
                    }
                })
            ], headers);
            navigator.sendBeacon("/beacon/players/" + localStorage.getItem('tmpPlayer') + "/leaveAll", blob);
            localStorage.removeItem("tmpPlayer");
        });

    },

    components: {App},
    template: '<App/>'
});

