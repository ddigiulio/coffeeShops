var currentCoffeeShops = [];
var template = "";
function initAutocomplete() {
    var pos;
    var testPosition = new google.maps.LatLng(47.6253, -122.3222)
    var map = new google.maps.Map(document.getElementById('map'), {
        center: testPosition,
        zoom: 14,
        mapTypeId: 'roadmap',
        disableDefaultUI: true,
        //code for map background
        styles: [
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "hue": "#0066ff"
                    },
                    {
                        "saturation": 74
                    },
                    {
                        "lightness": 100
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "weight": 0.6
                    },
                    {
                        "saturation": -85
                    },
                    {
                        "lightness": 61
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "color": "#5f94ff"
                    },
                    {
                        "lightness": 26
                    },
                    {
                        "gamma": 5.86
                    }
                ]
            }
        ]
    });

    var infoWindow = new google.maps.InfoWindow;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            map.setCenter(pos);
            pos = new google.maps.LatLng(pos.lat, pos.lng);
            //cache this position in local storage
            // searchPlaces(pos, map);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(card);
    var autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        pos = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng())
        searchPlaces(pos, map)
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

    });




}
function searchPlaces(pos, map) {
    var myurl = "https://theperfectcup.herokuapp.com/coffeeshops";
    // var myurl = "http://localhost:8080/coffeeshops";
    var prevMarkers = [];
    var markers = [];
    pos = pos;


    var service = new google.maps.places.PlacesService(map);
    var promise = new Promise(function (resolve, reject) {
        service.nearbySearch({
            location: pos,
            radius: '1000',
            types: ['cafe']
        }, callback);

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {

                resolve(results);
            }
            else {
                console.log("No coffeeshops nearby!")
                reject();
            }
        }
    })
        .then(function (results) {
            $('.infoBox').removeClass("hidden3");
            var places = results;
            if (places.length == 0) {
                return;
            }
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.

            var infowindow = new google.maps.InfoWindow({
            });
            var bounds = new google.maps.LatLngBounds();

            places = places.filter(function (place) {
                return place.icon === "https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png"
            });
            // console.log(places);
            places.forEach(function (place, i) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }

                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location,
                    address: place.vicinity,
                    rating: place.rating,
                    priciness: place.price_level,
                    placeRef: i,
                    infowindow: new google.maps.InfoWindow({
                    })
                }));

                google.maps.event.addListener(markers[i], 'click', function () {

                    this.setClickable(false);
                    var status;
                    prevMarkers.forEach(function (markerIndex, j) {

                        markers[markerIndex].infowindow.close();
                        markers[markerIndex].setClickable(true);

                        prevMarkers.splice(j, 1);
                    })

                    var infowindow = this.infowindow;
                    infowindow.maxWidth = 200;
                    prevMarkers.push(i);
                    var currentShop = places[markers[i].placeRef];
                    map.setCenter(currentShop.geometry.location);
                    if (currentShop.price_level == undefined) {
                        currentShop.price_level = "Not provided";
                    }

                    if (currentShop.rating == undefined) {
                        currentShop.rating = "Not provided"
                    }
                    if (currentShop.opening_hours == undefined) {
                        currentShop.opening_hours = "Not provided"
                    }
                    else if (currentShop.opening_hours) {
                        if (currentShop.opening_hours.open_now) {
                            status = "Open Now";
                        }
                        else if (!currentShop.opening_hours.open_now) {
                            status = "Closed";
                        }

                    }

                    infowindow.setContent(currentShop.name + '<br>' +
                        'Address: ' + currentShop.vicinity + '<br>' + 'Rating: ' + currentShop.rating + '<br>' +
                        'Price Level: ' + currentShop.price_level + '<br>' + status + '<br>' +
                        '<form id="userInput">' + '<br>' + 'Add a description:' + '<br>' + '<input type="text" size="60" maxlength="100" name="description">' + '</form>' +
                        '<button class="save">Save Coffeeshop</button>');
                    infowindow.open(map, this);

                    if (!google.maps.event.hasListeners(infowindow, 'domready')) {
                        infowindow.addListener('domready', () => {
                            $('button.save').on('click', function () {
                                var description = $('#userInput').serializeArray()[0].value;
                                if (description === "") {
                                    description = "~~~~~!@@!~~~~~"
                                }

                                jQuery.ajax({
                                    url: myurl,
                                    type: "POST",
                                    data: JSON.stringify
                                        ({
                                            name: currentShop.name,
                                            address: currentShop.vicinity,
                                            rating: currentShop.rating,
                                            description: description,
                                            price: currentShop.price_level
                                        }),
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8",
                                    success: function (data) {
                                        
                                        showCoffeeShops();
                                    }
                                });
                            });
                        });
                    }
                });
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }

                map.fitBounds(bounds);
            });
        });

}

function showCoffeeShops() {

    var myurl = "https://theperfectcup.herokuapp.com/coffeeshops";
    // var myurl = "http://localhost:8080/coffeeshops";
    var coffeeShopListTemplate = "";
    var templateMobile = "";
    var buttonRefs = ""
    $('ol').empty();
    $('.links').empty();
    $('.flex-container').empty();
    $.get(myurl).then(coffeeShops => {
        currentCoffeeShops = coffeeShops;
        coffeeShops.forEach(function (coffeeShop, i) {
            coffeeShopListTemplate += (
                '<li class="hvr-grow hvr-bubble-top" value="' + i + '">' +
                '<div class="coffeeShop">' +
                '<h3 class="name">' + coffeeShop.name + '</h3>' +
                '</div>' + '</li>'
            );

            buttonRefs += (
                '<a href="#slide-' + i + '"' + '>' + (i + 1) + '</a>'
            )

            /*template */
            templateMobile += (
                '<div class=coffeeShopMobile id="slide-' + i + '"' + "unique=" + coffeeShop.id + '>' +
                '<h3 class="name">' + coffeeShop.name + '</h3>'
                + '<span class="hoverText">' + "Rating: " + '</span>'
            );

            var rating = Math.round(coffeeShop.rating);
            for (var i = 0; i < rating; i++) {
                templateMobile += '<img src="bean.jpg" height="12" width="12">';

            }
            templateMobile += "<br>";

            if (coffeeShop.price != "Not provided") {

                var priceString = "";

                for (var i = 0; i < coffeeShop.price; i++) {
                    priceString += "$";
                }
                templateMobile += '<span class="hoverText">' + "Price: " + '</span>' + '<span class="priceText">' + priceString + '</span>' + '<br>'

            }
            if (coffeeShop.description !== "~~~~~!@@!~~~~~") {
                templateMobile += '<span class="hoverText">' + "Description: " + coffeeShop.description + '</span>';
            }
            templateMobile += "<br>";
            templateMobile += '<button type=button class="deleteShop">' + "Delete Shop" + '</button>'
            templateMobile += '</div>'
            /*template */
        });

        $('.links').prepend(buttonRefs);
        $('.coffeeShops').append(coffeeShopListTemplate);
        $('.flex-container').append(templateMobile);

    });
}


function signUpHandler() {
    var myurl = "https://theperfectcup.herokuapp.com/users/";
    // var myurl = "http://localhost:8080/users/"

    $('button.signUpButton').on("click", function () {
        $('.login').addClass("hidden");

        $('.signUp').removeClass('hidden');
    });
    $('button.goBack').on("click", function () {
        event.preventDefault();
        $('.signUp').addClass('hidden');
        $('.login').removeClass('hidden');

    })

    $('#signUpForm').on("submit", function (event) {
        
        event.preventDefault();
        var userName = this.username.value;
        var password = this.password.value;
        jQuery.ajax({
            url: myurl,
            type: "POST",
            data: JSON.stringify
                ({
                    "username": userName,
                    "password": password
                }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                logIn(data.username, data.password)
            },
            error: function (data) {

            }
        });
    })

}

function logInHandler() {
    $('#loginForm').on("submit", function (event) {
        event.preventDefault();
        var userName = this.username.value;
        var password = this.password.value;

        logIn(userName, password);

    });
}

function logOutHandler() {
    $('button.logOut').on("click", function () {
        event.preventDefault();
         var myurl = "https://theperfectcup.herokuapp.com/users/logout";
        // var myurl = "http://localhost:8080/users/logout"
        $.get(myurl, function (data) {
            $('.logOutBox').hide();
            $('.logOut').hide();

            $('.coffeeShops').empty();
            $('#splashPage').removeClass("hidden1");
            $('#searchBox').addClass("hidden");
            $('#tempBox').addClass("hidden1");
            $('.infoBox').addClass("hidden3");
            $('.flex-container').css("display", "none")

        });
    });
}

function logIn(userName, password) {
    var myurl = "https://theperfectcup.herokuapp.com/users/login";
    // var myurl = "http://localhost:8080/users/login";
    jQuery.ajax({
        url: myurl,
        type: "POST",
        data: JSON.stringify
            ({
                "username": userName,
                "password": password
            }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('form')[0].reset();
            currentCoffeeShops = [];

            $('#splashPage').addClass("hidden1");
            $('#pac-card').removeClass("hidden");
            
            $('#map').removeClass("hidden");
            $('#results').removeClass("hidden");
            $('.logOutBox').show();
            $('.logOut').show();
            $('.signUp').addClass('hidden');
            $('.login').removeClass('hidden');
            $('.flex-container').css("display", "flex")
            
            showCoffeeShops();

        }
    });

}

function deleteHandler() {
    $('.flex-container').on("click", ".deleteShop", function (event) {
        event.preventDefault()

          var myurl = "https://theperfectcup.herokuapp.com/coffeeshops/";
        // var myurl = "http://localhost:8080/coffeeshops/";
        event.preventDefault();
        $.ajax({
            url: myurl + $(this).parent().attr("unique"),
            type: "Delete",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                showCoffeeShops();

            },
            error: function (data) {

                console.log("error")
            }
        });

    })
}

function hoverHandler() {

    $('.coffeeShops').on("click", "li", function (event) {
        event.preventDefault();
        if ($(this).hasClass("clicked")) {
            $(this).removeClass("clicked");
            $('#tempBox').addClass("hidden1");
        }
        else {
            $(this).addClass("clicked");
            $('#tempBox').empty();
            var currentShop = ($(this).attr("value"));
            var bottomPosition = 80;
            var leftPosition = ($(this).position().left) - 25;
            var coffeeShop = currentCoffeeShops[currentShop];

            var template = "";
            template = (
                '<h3 class="name">' + coffeeShop.name + '</h3>'
                + '<span class="hoverText">' + "Rating: " + '</span>'
            );

            var rating = Math.round(coffeeShop.rating);
            for (var i = 0; i < rating; i++) {
                template += '<img src="bean.jpg" height="12" width="12">';

            }
            template += "<br>";

            if (coffeeShop.price != 100) {

                var priceString = "";

                for (var i = 0; i < coffeeShop.price; i++) {
                    priceString += "$";
                }
                template += '<span class="hoverText">' + "Price: " + '</span>' + '<span class="priceText">' + priceString + '</span>' + '<br>'

            }
            if (coffeeShop.description !== "~~~~~!@@!~~~~~") {
                template += '<span class="hoverText">' + "Description: " + coffeeShop.description + '</span>';
            }

            $('#tempBox').append(template);
            $('#tempBox').css({ 'bottom': bottomPosition, 'left': leftPosition });
            $('#tempBox').removeClass("hidden1");
        }
    });
}


$(deleteHandler);
$(signUpHandler);
$(logInHandler);
$(logOutHandler);
$(hoverHandler);



