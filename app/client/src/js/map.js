window.initMap = function (api = true) {
// initialisation de la map
    let mymap = L.map('map');
    let markers = [];

// Mise à jour de la map
    var updateMap = function () {
        // Affichage à la nouvelle position

        mymap.setView([$('#lat').val(), $('#lon').val()], $('#zoom').val());

        // La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
        return false;
    };
    var updateMapVue = function (lat, long, zoom) {
        // Affichage à la nouvelle position
        mymap.setView([lat, long], zoom);

        //mymap.setView([$('#lat').val(), $('#lon').val()], $('#zoom').val());

        // La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
        return false;
    };


    window.updateMapVue = updateMapVue;
    if (api) {
        updateMap();
        window.updateMap = updateMap;


    } else {
        /*
        L.easyButton('fa-globe', function(btn, map){
           alert("clicked")
        }).addTo( updateMapVue );

         */
        window.updateMapVue = updateMapVue;
        updateMapVue(45.78207, 4.86559, 12);

    }

    const centerOn = function (lat,long) {
        mymap.setView([lat, long], 12);
    }

    var defaulticon = L.icon({
        iconUrl: '/public/marker-icon.png',
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowUrl: '/public/my-icon-shadow.png',
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });

// Création d'un "tile layer" (permet l'affichage sur la carte)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=', {
        maxZoom: 20,
        minZoom: 1,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);

// Ajout d'un marker


    var addMarker = function (lat, lng, name, img) {
        let icon = L.icon({
            iconUrl: '/public/marker-icon.png',
            iconSize: [38, 95],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
            shadowUrl: '/public/my-icon-shadow.png',
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
        });
        icon.options.iconUrl = img && img !== '' && img !== ' ' ? img : '/public/marker-icon.png';
        //icon.options.iconUrl =  'https://image.flaticon.com/icons/svg/825/825590.svg'
        let m = new L.Marker([lat, lng], {icon: icon});
        markers.push(m);
        mymap.addLayer(m);
        m.bindPopup('<strong>' + name + '</strong>');

    };

    var getMarkers =  function () {
        return markers;
    };

    var cleanMarkers = function () {
        for (let i in markers) {
            mymap.removeLayer(markers[i]);
        }
        markers = [];
    };
    window.map = mymap;
    window.addMarker = addMarker;
    window.getMarkers = getMarkers;
    window.clearMarkers = cleanMarkers;
    window.centerOn = centerOn;
};


