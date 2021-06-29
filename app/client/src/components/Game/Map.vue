<template>

    <v-card style="z-index: 0" width="100%">
        <div style="width: 90%" :class="updateMap" id="map">
            <div class="leaflet-bottom leaflet-left">
                <div class="leaflet-control">
                    <v-btn depressed small @click="centerPos">Ma position</v-btn>
                </div>
            </div>


        </div>
    </v-card>

</template>

<script>
    export default {
        name: "playMap",
        mounted() {
            window.initMap(false);
        },
        computed: {
            updateMap() {
                let resources = this.getResources;
                if (!window.map){
                    console.log("Map is not initialized yet")
                    return;
                }
                this.cleanMap();
                if (!resources || !resources.manche || !resources.players) return;
                // Display targets
                resources.manche.targets.map((t) => {
                    this.addMarker(this.normalizeTarget(t))
                });
                // Display players
                resources.players.map((p) => {
                    this.addMarker(this.normalizePlayer(p))
                });
            },
        },
        methods: {
            centerPos() {
                let pos = this.getPlayerPos
                window.centerOn(pos[0], pos[1])
            },
            cleanMap() {
                this.cleanMarkers()
            },
            normalizePlayer(player) {
                return {
                    valid: player.position['lng'] && player.position['lat'],
                    lat: player.position['lat'],
                    lng: player.position['lng'],
                    name: player.id,
                    url: player.url,
                };
            },
            normalizeTarget(target) {
                return {
                    valid: target.pos[0] && target.pos[1],
                    lat: target.pos[0],
                    lng: target.pos[1],
                    name: target.name,
                    url: target.url,
                };
            },
            addMarker(target){
                if (!target.valid) return false;
                window.addMarker(target.lat,target.lng,target.name,target.url)
                return true;
            },
            cleanMarkers(){
                window.clearMarkers()
            },
            getMarkers(){
                return window.getMarkers()
            }
        }

    };
</script>

<style scoped>

</style>
