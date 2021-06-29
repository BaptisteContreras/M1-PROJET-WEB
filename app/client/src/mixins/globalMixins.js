import {mapActions, mapGetters} from 'vuex'
import globalMethods from './global/methods'
import globalComputed from './global/computed'
import globalData from './global/data'

import cacheMethods from './cache/methods'
import cacheComputed from './cache/computed'
import cacheData from './cache/data'


export default  {
    data () {return {...globalData, ...cacheData}},
    methods: {...globalMethods, ...cacheMethods},
    computed: {...globalComputed, ...cacheComputed}
}






