function initAutocomplete() {

    var testPosition = new google.maps.LatLng(47.6253, -122.3222)
    var map = new google.maps.Map(document.getElementById('map'), {
        center: testPosition,
        zoom: 14,
        mapTypeId: 'roadmap'
    });
    searchPlaces(testPosition, map);

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
            console.log("current pos: " + pos);
            $("#searchBox").css("display", "block");
            //cache this position in local storage
            searchPlaces(pos, map);
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

    console.log("test pos: " + testPosition);

}
function searchPlaces(pos, map) {
    var myurl = "http://localhost:8080/coffeeshops"; 
    var prevMarkers = [];
    var markers = [];
    pos = new google.maps.LatLng(47.6253, -122.3222)
    $('button.search-start').on('click', function () {
        event.preventDefault();
        $("#searchBox").hide();
        //will have to define and return position FIRST from current position API and not allow search until that is created

        //listen for updated location if user puts it 
        //later if this value isnt empty, convert it to an actual LATLNG OR return error and use current position
        var locationTemp = $(".search-input").val();
        console.log(locationTemp);
        //geocoding bro
        if(locationTemp != "")
        {
            getRequest(locationTemp);
        }
       
        //start a new search based on input but for right now use hardcoded location
        var service = new google.maps.places.PlacesService(map);

        var promise = new Promise(function (resolve, reject) {

            service.nearbySearch({
                location: pos,
                radius: '800',
                types: ['cafe']
            }, callback);

            function callback(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {

                    resolve(results);
                }
                else {
                    reject();
                }
            }
        })
            .then(function (results) {
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
                        prevMarkers.push(i);
                        var currentShop = places[markers[i].placeRef];

                        if (currentShop.price_level == undefined) {
                            currentShop.price_level = "Not Available";
                        }

                        if (currentShop.opening_hours) {
                            if (currentShop.opening_hours.open_now) {
                                status = "Open Now"
                            }
                            else {
                                status = "Closed"
                            }
                        }

                        infowindow.setContent('<div><strong>' + currentShop.name + '</strong><br>' +
                            'Address: ' + currentShop.vicinity + '<br>' + 'Rating: ' + currentShop.rating + '<br>' +
                            'Price Level: ' + currentShop.price_level + '<br>' + status + '<br>' + '</div>' +
                            ' ' + 'Add tags (separated by commas): <form id="userInput"><input type="text" size="60" maxlength="40" name="tags">' + '<br>' + 'Add a description:' + '<br>' + '<input type="text" size="60" maxlength="100" name="description">' + '</form>' +
                            '<button class="save">Save Coffeeshop</button>');
                        infowindow.open(map, this);

                        if (!google.maps.event.hasListeners(infowindow, 'domready')) {
                            infowindow.addListener('domready', () => {
                                $('button.save').on('click', function () {

                                    var tags = $('#userInput').serializeArray()[0].value.split(',');
                                    var description = $('#userInput').serializeArray()[1].value;
                                    console.log(tags);
                                    console.log(description);
                                    if (currentShop.photos !== undefined) {
                                        photo = currentShop.photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 });
                                    }
                                    else photo = "";

                                    jQuery.ajax({
                                        url: myurl,
                                        type: "POST",
                                        data: JSON.stringify
                                            ({
                                                name: currentShop.name,
                                                address: currentShop.vicinity,
                                                rating: currentShop.rating,
                                                tags: tags,
                                                photoURL: photo || "",
                                                lat: currentShop.geometry.location.lat(),
                                                lng: currentShop.geometry.location.lng(),
                                                description: description,
                                                price: currentShop.price_level

                                            }),
                                        dataType: "json",
                                        contentType: "application/json; charset=utf-8",
                                        success: function () {
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
                    // }//here
                    map.fitBounds(bounds);
                });
            });
    });
}

function showCoffeeShops() {

    var myurl = "http://localhost:8080/coffeeshops";

    var coffeeShopListTemplate = "";
    $('ul').empty();
    const getPromise = new Promise((resolve, reject) => {
        $.get(myurl, function (coffeeShops) {
            resolve(coffeeShops);
        });
    }).then(coffeeShops => {

        coffeeShops.forEach(function (coffeeShop) {
            //how to do distance??? pass in address to another function, get distance from location and display?
            //to work on
            coffeeShopListTemplate += (
                '<li>' + '<div class="coffeeShop">' +
                '<h3 class="name">' + coffeeShop.name + '</h3>'
                + '<span>' + "Rating: " + coffeeShop.rating + '</span>' + '<br>' +
                '<span>' + "Tags: " + coffeeShop.tags + '</span>' + '<br>' +
                '<span>' + "Description: " + coffeeShop.description + '</span>' + '<br>' +
                '<details><summary>View Photos.</summary>' +
                '<img src="' + coffeeShop.photoURL + '">'

                + '</details>' +

                '</div>' + '</li>'
            );
        });

        $('.coffeeShops').append(coffeeShopListTemplate);
    });

}
function getRequest(params) {
    var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${params}`;

    $.get(url, function (results) {
        console.log(results);
    });
}

function signIn(){
    var myurl = "http://localhost:8080/users";
    $('button.submit').on("click", function(){
        event.preventDefault();
        //this is the better way ==> change the value of the names in the form later
        //$.post( "test.php", $( "#testform" ).serialize() );
       var userName= $("form").serializeArray()[0].value;
       var password = $("form").serializeArray()[1].value;
       console.log("Username is: " + userName + " Password is: " + password);

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
            console.log(data);                                   
            }
        });
    });
}

$(signIn);
$(showCoffeeShops);