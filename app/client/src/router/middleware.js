export default function log(context) {
    let stores = context.stores;
    if ((!stores.getters['general/isConnected'] || !stores.getters['general/getToken'] || stores.getters['general/getToken'] === '')){
        if ( !localStorage.getItem('token') ||
            !localStorage.getItem('pseudo') ||
            localStorage.getItem('token') === '' ||
            localStorage.getItem('token') === null ||
            localStorage.getItem('pseudo') === '' ||
            localStorage.getItem('pseudo') === null

        ){
            return context.router.push({ name: 'Connection' });
        }else{
            stores.dispatch('general/setConnected', true);
            stores.dispatch('general/setToken', localStorage.getItem('token'));
            stores.dispatch('general/setPseudo', localStorage.getItem('pseudo'));

        }
    }
    return context.next();
}
