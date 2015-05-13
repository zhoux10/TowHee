'use strict';

// Articles controller
angular.module('maps').controller('MapsController', ['$http', '$scope', '$stateParams', '$location', 'Authentication', 'Events',
	function($http, $scope, $stateParams, $location, Authentication, Events) {
		$scope.createMapPage = function () {
			// Turn on Spinner
			$scope.showSpinner = true;
			$scope.initialrad = 25;

			// Set up Map
			var latitude,
					longitude;

		 	if (navigator.geolocation) {
	      navigator.geolocation.getCurrentPosition(
					// Set position to navigator's position upon success
					function (position) {
						latitude = position.coords.latitude;
						longitude = position.coords.longitude;
			    	$scope.position = {longitude: longitude, latitude: latitude};
						$scope.loadInfomation();
	      	},
					// Set position to California upon fail
					$scope.setPositionToCalifornia);
			} else {
				$scope.setPositionToCalifornia();
			}

			// Set up event listeners for slider
			$('#slider').on( 'click', function (_event) {
				$scope.loadInfomation();
			});

			// Set up event listener for places search box
			var input = document.getElementsByClassName('zipcode-input')[0];
			var searchBox = new google.maps.places.SearchBox(input);

			google.maps.event.addListener(searchBox, 'places_changed', function() {
				var places = searchBox.getPlaces();
				if (places.length === 0) {
					return;
				} else {
					var longitude = places[0].geometry.location.lng(),
							latitude = places[0].geometry.location.lat();
					$scope.position = {longitude: longitude, latitude: latitude};
					$scope.loadInfomation();
				}
			});
		};

		$scope.setPositionToCalifornia = function () {
			var latitude = 37.7833,
					longitude = -122.4167;
			$scope.position = {longitude: longitude, latitude: latitude};
			$scope.loadInfomation();
		};

		$scope.loadInfomation = function () {
			$scope.showSpinner = true;
			var latitude = $scope.position.latitude,
					longitude = $scope.position.longitude,
					radius = $scope.initialrad;

			$http.get('nearby?lng=' + longitude + '&lat=' + latitude + '&radius=' + radius).success(function(data){
				$scope.createMap(data);
				$scope.showSpinner = false;
			});
		};

    $scope.createMap = function(data) {
			var mapOptions = {
				zoom: 12,
				center: new google.maps.LatLng($scope.position.latitude, $scope.position.longitude),
				mapTypeId: google.maps.MapTypeId.TERRAIN
			};

			$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

			if (data.length > 0) {
		    $scope.infoWindow = new google.maps.InfoWindow();
				$scope.latlngbounds = new google.maps.LatLngBounds();
				$scope.markers = [];

				for (var i = 0; i < data.length; i++){
					$scope.createMarker(data[i]);
				}

				$scope.map.setCenter($scope.latlngbounds.getCenter());
				$scope.map.fitBounds($scope.latlngbounds);
			}
		};

		$scope.createMarker = function (info){
		  var marker = new google.maps.Marker({
	      map: $scope.map,
	      position: new google.maps.LatLng(info.location[1], info.location[0]),
	      title: "<a href='#!/events/"+ info._id + "'>" + info.title + "</a>"
      });

      marker.content = '<div class="infoWindowContent">' + info.content + '</div><br/><img width="160px" src=' + info.imageUrl + '>';

			// fit this marker in the map
			var myLatLng = new google.maps.LatLng(info.location[1], info.location[0]);
			$scope.latlngbounds.extend(myLatLng);

      google.maps.event.addListener(marker, 'click', function(){
          $scope.infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
          $scope.infoWindow.open($scope.map, marker);
      });

			$scope.markers.push(marker);
		};


    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };
	}
]);
