window.initAdminEditManche = function () {
    window.initMap()
    window.initForm()
    var currentEditManche = 1;
    var currentEditTarget = 1;
    var currentPos = ''
    var editPos = false;
    $("#btnAddManche").on('click', (e) => {
        e.preventDefault()
        let target = $(e.target)
        let mrows = $("#manchesRow").children('.mancheRow');
        let currentManche = mrows.length === 0 ? 1 : $(mrows[mrows.length-1]).data('manche')+1
        let copy = $('#metier').children('.mancheRow').clone()
        console.log(currentManche)
        copy.attr('data-manche',currentManche)
        let card = $($(copy).children('.card'))
        console.log(card.children('.card-header'))
        card.children('.card-header').attr('data-manche', currentManche)
        card.children('.card-header').on('click', (e) => {
            clearMarkers();
            displayMancheMarkers($(e.target).data('manche'))
        })
        card.children('.card-header').attr('id', 'heading'+currentManche)
        card.children('.card-header').attr('data-target', '#collapse'+currentManche)
        card.children('.card-header').attr('aria-controls', 'collapse'+currentManche)

        card.children('.card-header').children('h5').attr('data-manche', currentManche)
        card.children('.card-header').children('h5').children('a').attr('data-manche', currentManche)
        card.children('.card-header').children('h5').children('a').text("Manche n°"+currentManche)

        let collapse = card.children('.collapse')
        collapse.attr('id', 'collapse'+currentManche)
        collapse.attr('aria-labelledby', 'heading'+currentManche)
        collapse.children('.card-body').children('.row').children('.r1').children('.form-group').children('label').attr('for', 'ttl'+currentManche)
        collapse.children('.card-body').children('.row').children('.r1').children('.form-group').children('input').attr('id', 'ttl'+currentManche)
        collapse.children('.card-body').children('.row').children('.r1').children('.form-group').children('input').attr('name', 'ttl'+currentManche)
        collapse.children('.card-body').children('.targetsDiv').attr('id', 'targetsDiv'+currentManche)
        collapse.children('.card-body').children('.targetsDiv').attr('targetsDiv'+currentManche)
        collapse.children('.card-body').children('.r2').children('.col-12').children('button').attr('data-manche', currentManche)
        collapse.children('.card-body').children('.r2').children('.col-12').children('button').on('click', addTarget)
        console.log(collapse.children('.card-body').children('.r2'))
        $("#manchesRow").append(copy)
    })

    var addTarget = function(e){
        console.log("i'm cakked")
        e.preventDefault()
        let target = $(e.target)
        let currentManche = target.data('manche')
        let trows = $("#targetsDiv"+currentManche).children('.targetRow');
        let currentTarget = trows.length === 0 ? 1 : ($(trows[trows.length-1]).data('target')) + 1
        let copy = $('#metier').children('.targetRow').clone()
        copy.data('target', currentTarget)
        copy.data('manche',currentManche)
        copy.attr('id','targetRow'+currentManche+"-"+currentTarget)
        let rows = copy.children('.col-3')
        $(rows[0]).children('label').attr('for', 'tname'+currentTarget)
        $(rows[0]).children('input').attr('id', 'tname'+currentTarget)
        $(rows[0]).children('input').attr('name', 'tname'+currentManche+"-"+currentTarget)

        $(rows[1]).children('label').attr('for', 'tpos'+currentManche+"-"+currentTarget)
        $(rows[1]).children('input').attr('id', 'tpos'+currentManche+"-"+currentTarget)
        $(rows[1]).children('input').attr('name', 'tpos'+currentManche+"-"+currentTarget)

        $(rows[2]).children('label').attr('for', 'turl'+currentTarget)
        $(rows[2]).children('input').attr('id', 'turl'+currentTarget)
        $(rows[2]).children('input').attr('name', 'turl'+currentManche+"-"+currentTarget)

        $(rows[3]).children('.btnEditPosition').data('target', currentTarget)
        $(rows[3]).children('.btnEditPosition').data('manche', currentManche)
        $(rows[3]).children('.btnEditPosition').on('click', editTargetPosition)

        $(rows[3]).children('.btnDeleteTarget').data('target', currentTarget)
        $(rows[3]).children('.btnDeleteTarget').data('manche', currentManche)
        $(rows[3]).children('.btnDeleteTarget').on('click', deleteTarget)


        $("#targetsDiv"+currentManche).append(copy)
    }
    $(".btnAddTarget").on('click', addTarget)

    var editTargetPosition = function(e) {
        e.preventDefault();
        let tmpManche = $(e.target).data('manche');
        let tmpTarget = $(e.target).data('target');
        if (editPos && (currentEditManche !== tmpManche || currentEditTarget !== tmpTarget)) return false;
        currentEditManche = tmpManche
        currentEditTarget = tmpTarget
        editPos = !editPos;
        if(editPos){
            $(e.target).text('Terminer')
            $(e.target).addClass('btn-warning')
            $(e.target).removeClass('btn-success')
        }else{
            $(e.target).removeClass('btn-warning')
            $(e.target).addClass('btn-success')
            $(e.target).text('Editer Position')
            clearMarkers()
            displayMancheMarkers(currentEditManche)
        }
        currentPos = '';

    }

    var deleteTarget = function(e){
        e.preventDefault();
        let tmpManche = $(e.target).data('manche');
        let tmpTarget = $(e.target).data('target');
        $("#targetRow"+tmpManche+"-"+tmpTarget).remove()
    }

    $(".btnEditPosition").on('click', editTargetPosition)
    $(".btnDeleteTarget").on('click', deleteTarget)

    var map = window.map


    var handleTargetPosition = function(e){
        e.preventDefault()
        if (editPos) $("#tpos"+currentEditManche+"-"+currentEditTarget).val(currentPos.lat.toFixed(4)+ "/" + currentPos.lng.toFixed(4) )
    }
    $("#btnDeleteManche").on('click', (e) => {
        e.preventDefault();
        $("#manchesRow").children('.mancheRow').last().remove()
        clearMarkers();

    })
    var clearMarkers = function(){
        $(".leaflet-marker-icon").remove(); $(".leaflet-popup").remove();
    }
    $(".card-header").on('click', (e) => {
        clearMarkers();
        displayMancheMarkers($(e.target).data('manche'))
    })
    var displayMancheMarkers = function(manche){
        let targets = $("#targetsDiv"+manche).children('.targetRow')
        targets.each((i,e) => {
            let rows = $(e).children('.col-3')
            let name = $(rows[0]).children('input').val()
            let pos = $(rows[1]).children('input').val().split('/')
            let img = $(rows[2]).children('input').val()
            if (pos.length === 2 ) {
                window.addMarker(
                    pos[0],
                    pos[1],
                    name,
                    img
                )
            }

        })


    }

    $("#modifForm").on('submit', (e) => {
        e.preventDefault();
        var object = {};
        (new FormData(e.target)).forEach((value, key) => {object[key] = value});
        object["nbManches"] =  $("#manchesRow").children(".mancheRow").length
        var json = JSON.stringify(object);
        $.ajax({
            url : './manches',
            method : "patch",
            data: json,
            processData: false,
            headers : {
                "Content-Type" : "application/json"
            },
            success : (d) => {
                alert("Modification ok")
                location.reload()
            },
            error : (e) => {
                alert('Le formulaire contient des erreurs')
            }



        })
    })

    window.a = handleTargetPosition
    map.on('click', function(e) {
        if (editPos){
            currentPos = e.latlng;
            var popup = L.popup()
                .setLatLng(currentPos)
                .setContent(currentPos+ " <br> valider ces coordonées pour la cible "+ currentEditTarget +" de la manche " + currentEditManche+" ? <button id='confirmTarget' onclick='window.a(event)' class='btn btn-success'>Oui</button>")
                .openOn(map);
        }
    });

}
