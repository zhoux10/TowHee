'use strict';

// Articles controller
angular.module('maps').controller('MapsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Maps) {
		$scope.authentication = Authentication;

		var data = [{
		  eventName : 'Animal Shelter',
		  description : 'abc',
		  id : 1,
		  locationlat : 37.315,
		  locationlon : -121.89
		},
		{
		  eventName : 'Volunteer 2',
		  description : 'abc',
		  id : 2,
		  locationlat : 38.32,
		  locationlon : -125.89
		},
		{
		  eventName : 'Animal Shelter',
		  description : 'abc',
		  id : 3,
		  locationlat : 40.32,
		  locationlon : -125.89
		}
		];

		$scope.map = {
			center: { latitude: 45, longitude: -73 }, zoom: 8
		};

    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info){

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.locationlat, info.locationlon),
            title: info.eventName
        });
        marker.content = '<div class="infoWindowContent">' + info.description + '</div>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);

    };

    for (var i = 0; i < data.length; i++){
        createMarker(data[i]);
    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };
	}
]);
