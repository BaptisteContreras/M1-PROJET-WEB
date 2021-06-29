import {mapActions} from "vuex";

export default {


    initServiceWorker() {
        const _this = this;
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(this.serviceWorkerUrl).then(function (registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                _this.$toastr.s("Service worker en place");

            }, function (err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
                _this.$toastr.e("Le service worker n'a pas réussi à être crée.");
            });

        } else {
            _this.$toastr.e("Votre navigateur ne supporte pas les workers");
        }
    }


};
