

function initAutocomplete() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 47.6253, lng: -122.3222 },
        zoom: 14,
        mapTypeId: 'roadmap'
    });


    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.\
    //this is the search function
    // var random = Math.floor(Math.random() * 10);
    searchBox.addListener('places_changed', function () {
        //places changed is an event for input into a search box
        var places = searchBox.getPlaces();


        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];


        var service = new google.maps.places.PlacesService(map);
        // For each place, get the icon, name and location.

        var infowindow = new google.maps.InfoWindow({
        });
        var bounds = new google.maps.LatLngBounds();

        var myurl = "http://localhost:8080/coffeeshops";
        var tags = ["fun!", " nice atmosphere!!"]
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
                address: place.formatted_address,
                rating: place.rating,
                placeRef: i
            }));

            google.maps.event.addListener(markers[i], 'click', function () {
                var currentShop = places[this.placeRef];
                infowindow.setContent('<div><strong>' + this.title + '</strong><br>' +
                    'Address: ' + this.address + '<br>' + 'Rating: ' + this.rating + '<br>' + '<button class="save">Save! </button>' + '</div>');
                infowindow.open(map, this);
                infowindow.addListener('domready', () => {
                    
                    $('button.save').on('click', function (evt, currentShop) {

                         jQuery.ajax({
                            url: myurl,
                            type: "POST",
                            data: JSON.stringify
                                ({
                                    name: currentShop.name,
                                    address: currentShop.formatted_address,
                                    rating: currentShop.rating,
                                    tags: tags,
                                    photos: currentShop.photos
                                }),
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            success: function () {
                                console.log("successfully added");
                            }
                        });
                    });
                });
            });


            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}




function showCoffeeShops() {

    var myurl = "http://localhost:8080/coffeeshops";

    $('.show').on("click", function (event) {
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
                    '<li>' + '<div>' +
                    '<span>' + "Name: " + coffeeShop.name + '</span>' + '<br>'
                    + '<span>' + "Rating: " + coffeeShop.rating + '</span>' + '<br>' +
                    '<span>' + "Tags: " + coffeeShop.tags + '</span>' + '<br>' +
                    '<span>' + "Distance: " + '</span>' +

                    '</div>' + '</li>'
                );

            });

            $('.coffeeShops').append(coffeeShopListTemplate);
        });
    });
}

$(showCoffeeShops);