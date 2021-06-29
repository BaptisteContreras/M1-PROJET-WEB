window.initForm = function () {
// MàJ de l'indicateur numérique du zoom
    function updateZoomValue() {
        $('#zoomValue').html($('#zoom').val());
        updateMap();
    }

// Abonnement aux événements de changement
    $('#lat').change(updateMap);
    $('#lon').change(updateMap);
    $('#zoom').change(updateZoomValue);
}
