import Vue from 'vue';
import Router from 'vue-router';
import stores from '../stores'


const  Index = () => import('../components/Index.vue');
const  Connection = () => import('../components/Connection.vue');
const  Error404 = () => import('../components/Error404.vue');
const  PageOptions = () => import('../components/PageOptions.vue');
const  Games = () => import('../components/GameList.vue');
const  GamesPlayerList = () => import('../components/GamePlayerList.vue');
const  PlayScreen = () => import('../components/Game/GamePage.vue');
const  SpectateScreen = () => import('../components/Game/SpectatePage.vue');
const  TrophyList = () => import('../components/TrophyList.vue');
const  Header = () => import('../components/Includes/Header.vue');
const  Results = () => import('../components/Game/Results.vue');

import log from './middleware';

Vue.use(Router);
const router = new Router({
    routes: [
        {
            path: '/',
            name: 'Index',
            components: {
                default: Index,
                Header
            },
            meta: {
                middleware: [
                    log
                ],
            }

        },
        {
            path: '/options',
            name: 'Options',
            components: {
                default: PageOptions,
                Header
            },
            meta: {
                middleware: [
                    log
                ],
            }

        },
        {
            path: '/games',
            name: 'Games',
            components: {
                default: Games,
                Header
            },
            meta: {
                middleware: [
                    log
                ],
            }

        },
        {
            path: '/games/:game/players',
            name: 'GamePlayerList',
            components: {
                default: GamesPlayerList,
                Header
            },
            meta: {
                middleware: [
                    log
                ],
            }

        },
        {
            path: '/games/:game/play',
            name: 'Play',
            components: {
                default: PlayScreen,
                Header
            },
            meta: {
                middleware: [
                    log
                ],
            }

        },
        {
            path: '/games/:game/resultats',
            name: 'Results',
            components: {
                default: Results,
                Header
            },
            meta: {
                middleware: [
                    log
                ],
            }

        },
        {
            path: '/games/:game/spectate',
            name: 'Spectate',
            components: {
                default: SpectateScreen,
                Header
            },
            meta: {
                middleware: [
                    log
                ],
            }

        },
        {
            path: '/trophy',
            name: 'Trophy',
            components: {
                default: TrophyList,
                Header
            },
            meta: {
                middleware: [
                    log
                ],
            }

        },
        {
            path: '/login',
            name: 'Connection',
            components: {
                full: Connection,
            },
            meta: {
                full  :true
            }
        },
        {
            path: '*',
            name: 'Error',
            components: {
             //   default: Error404,
                full: Error404,
            },
            meta: {
                full  :true
            }
        },
    ]
});

router.beforeEach((to, from, next) => {
    if (!to.meta.middleware) {
        return next()
    }
    const middleware = to.meta.middleware;

    const context = {
        to,
        from,
        next,
        stores,
        router,
        vue: router.app
    };


    return middleware[0]({
        ...context,
    })

});
export default router;
