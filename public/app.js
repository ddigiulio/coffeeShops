var pos;
function initAutocomplete() {
    var infoWindow;
    var prevMarkers = [];
    var myurl = "http://localhost:8080/coffeeshops";

    var testPosition = new google.maps.LatLng(47.6253, -122.3222)
    var map = new google.maps.Map(document.getElementById('map'), {
        center: testPosition,
        zoom: 14,
        mapTypeId: 'roadmap'
    });

    $('button.search-start').on('click', function () {
        event.preventDefault();

        //will have to define and return position FIRST from current position API and not allow search until that is created

        //listen for updated location if user puts it 
        //later if this value isnt empty, convert it to an actual LATLNG OR return error and use current position
        var locationTemp = $(".search-input").val();

        //start a new search based on input but for right now use hardcoded location
        var service = new google.maps.places.PlacesService(map);

        var promise = new Promise(function (resolve, reject) {

            service.nearbySearch({
                location: testPosition,
                radius: '500',
                keyword: "coffee shops"
            }, callback);

            function callback(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // for (var i = 0; i < results.length; i++) {
                    //     console.log(results[i]);
                    // }
                    resolve(results);
                }
                else{
                    reject();
                }
            }         
        })
        .then(function(results){
            var places = results;
        })


    });

    // infoWindow = new google.maps.InfoWindow();

    // infoWindow = new google.maps.InfoWindow;
    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function (position) {
    //         pos = {
    //             lat: position.coords.latitude,
    //             lng: position.coords.longitude
    //         };

    //         infoWindow.setPosition(pos);
    //         map.setCenter(pos);
    //         console.log(pos);
    //     }, function () {
    //         handleLocationError(true, infoWindow, map.getCenter());
    //     });
    // } else {

    //     handleLocationError(false, infoWindow, map.getCenter());
    // }

    // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    //     infoWindow.setPosition(pos);
    //     infoWindow.setContent(browserHasGeolocation ?
    //         'Error: The Geolocation service failed.' :
    //         'Error: Your browser doesn\'t support geolocation.');
    //     infoWindow.open(map);
    // }


    // var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.\
    //this is the search function



    // searchBox.addListener('places_changed', function () {
    //     //places changed is an event for input into a search box
    //     var places = searchBox.getPlaces();

    //     if (places.length == 0) {
    //         return;
    //     }

    //     markers.forEach(function (marker) {
    //         marker.setMap(null);
    //     });
    //     markers = [];

    //     var service = new google.maps.places.PlacesService(map);
    //     // For each place, get the icon, name and location.

    //     var infowindow = new google.maps.InfoWindow({
    //     });
    //     var bounds = new google.maps.LatLngBounds();

    //     ;

    //     //uncomment starting here

    //     // places.forEach(function (place, i) {
    //     //     if (!place.geometry) {
    //     //         console.log("Returned place contains no geometry");
    //     //         return;
    //     //     }

    //     //     var icon = {
    //     //         url: place.icon,
    //     //         size: new google.maps.Size(71, 71),
    //     //         origin: new google.maps.Point(0, 0),
    //     //         anchor: new google.maps.Point(17, 34),
    //     //         scaledSize: new google.maps.Size(25, 25)
    //     //     };

    //     //     // Create a marker for each place.
    //     //     markers.push(new google.maps.Marker({
    //     //         map: map,
    //     //         icon: icon,
    //     //         title: place.name,
    //     //         position: place.geometry.location,
    //     //         address: place.formatted_address,
    //     //         rating: place.rating,
    //     //         placeRef: i,
    //     //         infowindow: new google.maps.InfoWindow({
    //     //         })
    //     //     }));

    //     //     google.maps.event.addListener(markers[i], 'click', function () {
    //     //         this.setClickable(false);

    //     //         prevMarkers.forEach(function (markerIndex, j) {

    //     //             markers[markerIndex].infowindow.close();
    //     //             markers[markerIndex].setClickable(true);

    //     //             prevMarkers.splice(j, 1);
    //     //         })

    //     //         var infowindow = this.infowindow;
    //     //         prevMarkers.push(i);
    //     //         var currentShop = places[markers[i].placeRef];

    //     //         infowindow.setContent('<div><strong>' + this.title + '</strong><br>' +
    //     //             'Address: ' + this.address + '<br>' + 'Rating: ' + this.rating + '<br>' + '</div>' +
    //     //             ' ' + 'Add tags (separated by commas): <form><input type="text" size="60" maxlength="40" name="tags">' + '<br>' + 'Add a description:' + '<br>' + '<input type="text" size="60" maxlength="100" name="description">' + '</form>' +
    //     //             '<button class="save">Save Coffeeshop</button>');
    //     //         infowindow.open(map, this);


    //     //         if (!google.maps.event.hasListeners(infowindow, 'domready')) {
    //     //             infowindow.addListener('domready', () => {

    //     //                 $('button.save').on('click', function () {


    //     //                     var tags = $('form').serializeArray()[0].value.split(',');
    //     //                     var description = $('form').serializeArray()[1].value;

    //     //                     if (currentShop.photos !== undefined) {

    //     //                         photo = currentShop.photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 });
    //     //                     }
    //     //                     else photo = "";

    //     //                     jQuery.ajax({
    //     //                         url: myurl,
    //     //                         type: "POST",
    //     //                         data: JSON.stringify
    //     //                             ({
    //     //                                 name: currentShop.name,
    //     //                                 address: currentShop.formatted_address,
    //     //                                 rating: currentShop.rating,
    //     //                                 tags: tags,
    //     //                                 photoURL: photo || "",
    //     //                                 lat: currentShop.geometry.location.lat(),
    //     //                                 lng: currentShop.geometry.location.lng(),
    //     //                                 description: description

    //     //                             }),
    //     //                         dataType: "json",
    //     //                         contentType: "application/json; charset=utf-8",
    //     //                         success: function () {
    //     //                             showCoffeeShops();
    //     //                         }
    //     //                     });
    //     //                 });
    //     //             });
    //     //         }
    //     //     });

    //     //     if (place.geometry.viewport) {
    //     //         // Only geocodes have viewport.
    //     //         bounds.union(place.geometry.viewport);
    //     //     } else {
    //     //         bounds.extend(place.geometry.location);
    //     //     }
    //     // });
    //     map.fitBounds(bounds);
    // });
}

//do i have to put all my code for the places objects in this callback?  




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
function getRequest() {
    //for distance later
}

$(getRequest);
$(showCoffeeShops);