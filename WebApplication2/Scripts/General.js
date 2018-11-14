var lat;
var lng;
$(document).ready(function () {

    $('#error').hide();
    $("#success").hide();
    var marker = null;

    var property = new Object();
    var arrayCountry = ['México'];
    var arrayState = [];
    var properties = [];


    $('select').select2({
        tags: true,
        language: {

            noResults: function () {

                return "No hay resultados";
            },
            searching: function () {

                return "Buscando..";
            }
        }
    });

    //carga de arreglos
    arrayCountry.forEach(function (Country) {
        var opt = document.createElement('option');
        opt.innerHTML = Country;
        opt.value = Country;
        $("#cboCountry").append(opt);
    });

    arrayState.forEach(function (State) {
        var opt = document.createElement('option');
        opt.innerHTML = State;
        opt.value = State;
        $("#cboState").append(opt);
    });
    jQuery.extend(jQuery.validator.messages, {
        required: "Este dato es obligatorio.",
        remote: "Please fix this field.",
        email: "Please enter a valid email address.",
        url: "Please enter a valid URL.",
        date: "Please enter a valid date.",
        dateISO: "Please enter a valid date (ISO).",
        number: "Pro favor ingrese un número válido.",
        digits: "Please enter only digits.",
        creditcard: "Please enter a valid credit card number.",
        equalTo: "Please enter the same value again.",
        accept: "Please enter a value with a valid extension.",
        maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
        minlength: jQuery.validator.format("Please enter at least {0} characters."),
        rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
        range: jQuery.validator.format("Please enter a value between {0} and {1}."),
        max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
        min: jQuery.validator.format("El precio no puede ser menor a $50,000")
    });
    $("#formProperty").validate({
        rules: {
            cboPropertyType: "required",
            cboOperationType: "required",
            txtPrice: "required",
            cboCountry: "required",
            cboState: "required",
            cboCity: "required",
            cboNeighborhood: "required"
        },
        messages: {
            cboPropertyType: "Favor de introducir un Nombre a su property",
            cboOperationType: "Favor de elegir el tipo de operación",
            //txtPrice: "El precio es obligatorio",
            cboCountry: "Favor de elegir el Country",
            cboState: "Favor de escribir el State de la property",
            cboCity: "Favor de escribir la ciudad de la property",
            cboNeighborhood: "Favor de elegir la Neighborhood de la property"
        },
        // Called when the element is invalid:
        highlight: function (element) {
            $(element).css('background', '#ffdddd');

        },

        // Called when the element is valid:
        unhighlight: function (element) {
            $(element).css('background', '#ffffff');
        }
    });


    //Guadar la informacion de la property
    $('#btnSaveProperty').click(function (event) {
        event.preventDefault();
        var validator = $("#formProperty").validate();
        if (validator.form() !== false) {
            var propertie = {
                Id: 0,
                PropertyTypeId: $("#cboPropertyType").val(),
                CoordX: lat,
                CoordY: lng,
                Price: $('#txtPrice').val(),
                StateId: $("#cboState").val(),
                OperationTypeId:$("#cboOperationType").val()
            };
            $.ajax({
                type: 'POST',
                url: 'http://localhost:3137/api/property',
                data: propertie,
                ////contentType: 'application/json;',
                success: function (data) {
                    $("#modalProperty").modal('toggle');
                    //$("#success").animate({ top: '0px' }, {
                    //    duration: 3000
                    //});
                    //$("#success").html("Error: Al intentar guardar la propiedad");
                    //$('#success').show();
                    //$('#success').fadeOut(4000);
                    //$("#success").animate({ top: '250px' });
                },
                error: function (xhr, textStatus, thrownError) {
                    $("#modalProperty").modal('toggle');
                    $("#error").animate({ top: '0px' }, {
                        duration: 3000
                    });
                    $("#error").html("Error: Al intentar guardar la propiedad");
                    $('#error').show();
                    $('#error').fadeOut(4000);
                    $("#error").animate({ top: '250px' });
                }
            });
        }
    });

    getProperties();
    loadPropertyType();
    loadOperationType();
    loadState();
    function loadPropertyType() {
        $.ajax({
            url: 'http://localhost:3137/api/propertytype',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#cboPropertyType').select2({ data: data });
            },
            error: function (xhr, textStatus, thrownError) { }
        })
    };

    function loadOperationType() {
        $.ajax({
            url: 'http://localhost:3137/api/operationtype',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $("#cboOperationType").select2({ data: data });
            },
            error: function (xhr, textStatus, thrownError) { }
        });
    }

    function loadState() {
        $.ajax({
            url: 'http://localhost:3137/api/state',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $("#cboState").select2({ data: data });
            },
            error: function (xhr, textStatus, thrownError) {
            }

        });
    }
});

var map;
var geocoder;

function centerMapByCurrentLocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Aquí estoy.');
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 21
    });
    geocoder = new google.maps.Geocoder();
    var infoWindow = new google.maps.InfoWindow({ map: map });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Aquí estoy.');
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function clearForm() {
        $("#txtPrice").val('');
    }

    $('#btnAgregarEventoClic').click(function () {
        google.maps.event.addListener(map, "click", function (event) {

            clearForm();
            lat = event.latLng.lat();
            lng = event.latLng.lng();

            marker = new google.maps.Marker({
                position: event.latLng,
                map: map,
                title: 'Nueva property'
            });
            $('#modalProperty').modal({ backdrop: 'static', keyboard: false });
            google.maps.event.clearListeners(map, 'click');

            //obtenemos los datos de address
            geocoder.geocode({ 'latLng': event.latLng }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var result = results[0].address_components;
                    var address = ObtenerInformacion(result)


                    if (address.State !== null) {
                        var index = $("#cboState option:contains('" + address.State + "')").val()
                        $("#cboState").select2("val", index);
                    }
                    if (address.City !== null && $("#cboCity option:contains('" + address.City + "')").val() === undefined) {
                        var data = {
                            id: 1,
                            text: address.City
                        };
                        var newOption = new Option(data.text, data.id, false, false);
                        $('#cboCity').append(newOption).trigger('change');
                    }
                    if (address.Neighborhood !== null && $("#cboNeighborhood option:contains('" + address.Neighborhood + "')").val() === undefined) {
                        var data = {
                            id: 1,
                            text: address.Neighborhood
                        };
                        var newOption = new Option(data.text, data.id, false, false);
                        $("#cboNeighborhood").append(newOption).trigger('change');
                    }

                    $("#txtStreet").val(address.Street);
                    $('#txtPC').val(address.PC);

                } else {

                }
            });

        });

        function ObtenerInformacion(result) {
            var address = {};
            $.each(result, function (index, value) {
                switch (value.types[0]) {
                    case "street_number":
                        address.StretNumber = value.long_name;
                    case "route":
                        if (address.StretNumber !== undefined)
                            address.Street = value.long_name + " " + address.StretNumber;
                        else
                            address.Street = value.long_name;
                        break;
                    //case "neighborhood":
                    //    address.Neighborhood = value.long_name;
                    //    break;

                    case "political":
                        address.Neighborhood = value.long_name;
                        break;
                    case "administrative_area_level_3":
                        address.City = value.long_name;
                        break;
                    case "administrative_area_level_1":
                        address.State = value.long_name;
                        break;
                    case "country":
                        address.Country = value.long_name;
                        break;
                    case "postal_code":
                        address.PC = value.long_name;
                        break;


                }
            });
            return address;
        }


        $('#modalProperty').on('hidden.bs.modal', function () {
            marker.setMap(null);
        })






    });


    //var foundLocation = function (city, state, country, lat, lon) {
    //    //do stuff with your location! any of the first 3 args may be null
    //    console.log(arguments);
    //}


}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function getProperties() {
    $.ajax({
        url: 'http://localhost:3137/api/property',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            properties = data;
            $.each(data, function (index, value) {
                var marker = new google.maps.Marker({
                    position: { lat: Number(value.CoordX), lng: Number(value.CoordY) },
                    map: map,
                    title: value.Price.toString()
                });
            });
        },
        error: function (xhr, textStatus, thrownError) {
        } 
    });
}


