var currentCoffeeShops = [];
function initAutocomplete() {
    $(".logOut").hide();
    var testPosition = new google.maps.LatLng(47.6253, -122.3222)
    var map = new google.maps.Map(document.getElementById('map'), {
        center: testPosition,
        zoom: 14,
        mapTypeId: 'roadmap',
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
    },
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
    // searchPlaces(testPosition, map);

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
}
function searchPlaces(pos, map) {

    var myurl = "http://localhost:8080/coffeeshops";
    var prevMarkers = [];
    var markers = [];
    pos = pos;
    $('button.search-start').on('click', function () {
        event.preventDefault();
        $("#searchBox").hide();
        
        // var locationTemp = $(".search-input").val();
        // new Promise(function(resolve, reject) {
        //     if(!locationTemp) {
        //         resolve();
        //     }
        //     else({
        //         getRequest(locationTemp)

        //     })    
            // do your async stuff, and then resolve it
        // }).then(function(){

        // });
        
    
        // if (locationTemp != "") {
        //     var promise = new Promise(function (resolve, reject){
        //         getRequest(locationTemp);
        //     }, callback);
        //     function callback(results){
        //         if(results){
        //             resolve(results);
        //         } 
        //     }
        // }
        // console.log(pos);
        //start a new search based on input but for right now use hardcoded location
        
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
                var places = results;
                if (places.length == 0) {
                    return;
                }
                // console.log(places);
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

                        if (currentShop.price_level == undefined) {
                            currentShop.price_level = 100;
                        }

                        if (currentShop.opening_hours) {
                            if (currentShop.opening_hours.open_now) {
                                status = "Open Now"
                            }
                            else {
                                status = "Closed"
                            }
                        }

                        infowindow.setContent( currentShop.name + '<br>' +
                            'Address: ' + currentShop.vicinity + '<br>' + 'Rating: ' + currentShop.rating + '<br>' +
                            'Price Level: ' + currentShop.price_level + '<br>' + status + '<br>'  +
                             '<form id="userInput">' + '<br>' + 'Add a description:' + '<br>' + '<input type="text" size="60" maxlength="100" name="description">' + '</form>' +
                            '<button class="save">Save Coffeeshop</button>');
                        infowindow.open(map, this);

                        if (!google.maps.event.hasListeners(infowindow, 'domready')) {
                            infowindow.addListener('domready', () => {
                                $('button.save').on('click', function () {

                                    var description = $('#userInput').serializeArray()[0].value;
                                    if (description === "")
                                    {
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
                                            jQuery.ajax({
                                                url: "http://localhost:8080/users",
                                                type: "PUT",
                                                data: JSON.stringify
                                                    ({
                                                        coffeeshop: data.address
                                                    }),
                                                dataType: "json",
                                                contentType: "application/json; charset=utf-8",
                                                success: function (data) {
                                                    showCoffeeShops();
                                                }
                                            });
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
    $('ol').empty();
    const getPromise = new Promise((resolve, reject) => {
        $.get(myurl, function (coffeeShops) {
            resolve(coffeeShops);
        });
    }).then(coffeeShops => {
        currentCoffeeShops = coffeeShops;
        coffeeShops.forEach(function (coffeeShop, i) {
            //how to do distance??? pass in address to another function, get distance from location and display?
            //to work on
            coffeeShopListTemplate += (
                '<li class="hvr-grow hvr-bubble-top" value="'+ i + '">' + 
                '<div class="coffeeShop">' +
                '<h3 class="name">' + coffeeShop.name + '</h3>' +
                '</div>' +'</li>'
            );
        });
        $('.coffeeShops').append(coffeeShopListTemplate);
    });
}

function signUpHandler() {
    var myurl = "http://localhost:8080/users/";
    $('button.signUp').on("click", function () {
        event.preventDefault();

        var userName = $("form").serializeArray()[0].value;
        var password = $("form").serializeArray()[1].value;
        console.log("userName:" + userName + " passWord:" + password)
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
                console.log("successfully signed up")
                logIn(data.username, data.password)
            }, 
            error: function(data){
                // console.log(data);             
            }
        });
    });
}

function logInHandler() {
    $('button.logIn').on("click", function () {
        event.preventDefault();

        var userName = $("form").serializeArray()[0].value;
        var password = $("form").serializeArray()[1].value;
        logIn(userName, password);

    });
}

function logOutHandler() {
    $('button.logOut').on("click", function(){
         event.preventDefault();
         var myurl = "http://localhost:8080/users/logout";
          $.get(myurl, function (data) {
            $('button.logOut').hide();
            $('.logIns').show();
            // $('#map').width('100%');
            $('.coffeeShops').empty();
       
        });
    });
}

function logIn(userName, password) {
    var myurl = "http://localhost:8080/users/login";
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
            $(".logIns").hide();
            $(".logOut").show();
            currentCoffeeShops = [];
            showCoffeeShops();
        }
    });
}

function hoverHandler(){

    $('.coffeeShops').on("click", "li", function(event){
        event.preventDefault();
        if($(this).hasClass("clicked"))
        {
            $(this).removeClass("clicked");
            $('#tempBox').addClass("hidden");
        }
        else{
        $(this).addClass("clicked");
        $('#tempBox').empty();
        var currentShop =($(this).attr("value"));
        var bottomPosition = 80;
        var leftPosition = ($(this).position().left)-25;
        var coffeeShop = currentCoffeeShops[currentShop];
        
        var template = "";
        template =  (                         
                '<h3 class="name">' + coffeeShop.name + '</h3>'
                + '<span class="hoverText">' + "Rating: " + '</span>'
            );
        
        var rating = Math.round(coffeeShop.rating);
        for (var i=0; i < rating; i++){
            template+= '<img src="bean.jpg" height="12" width="12">';
            
        }
        template+="<br>";
       
        if (coffeeShop.price != 100){

            var priceString = "";
            
            for(var i = 0; i < coffeeShop.price; i++ )
            {
                priceString += "$";
            }
            template += '<span class="hoverText">' + "Price: "  + '</span>' + '<span class="priceText">' +  priceString+ '</span>' + '<br>'
  
        }
        if (coffeeShop.description !== "~~~~~!@@!~~~~~")
        {
            template += '<span class="hoverText">' + "Description: " + coffeeShop.description + '</span>'; 
        }

        $('#tempBox').append(template);
        $('#tempBox').css({'bottom' : bottomPosition , 'left' : leftPosition} );
        $('#tempBox').removeClass("hidden");
        }
    });
}

function deleteUsers(){
     var myurl = "http://localhost:8080/users/deleteAll";

    $('button.deleteUsers').on("click", function () {
        event.preventDefault();
        jQuery.ajax({
            url: myurl,
            type: "Delete",
            data: JSON.stringify
                ({
                }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log("successfully deleted USERS")
                
            }, 
            error: function(data){
                // console.log(data);             
            }
        });
    });
  
}

$(signUpHandler);
$(logInHandler);
$(logOutHandler);
$(hoverHandler);
// $(deleteUsers);


