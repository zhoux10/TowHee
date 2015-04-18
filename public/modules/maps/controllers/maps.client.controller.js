'use strict';

// Articles controller
angular.module('maps').controller('MapsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Maps) {

 	if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position){
         $scope.$apply(function(){
         $scope.position = position;
         $scope.map.position = position;
         });
        });
        }
		$scope.authentication = Authentication;

		var data = [{
									title : 'Sunnyvale',
									content : 'Animal Shelter Volunteer April 18 2015 10 am - 4 pm , http://www.animalshelter.org',
									location : [37.36, -121.886]
								},
								{
									title : 'San Jose',
									content : 'Women Who Code Volunteer',
									location : [37.3760, -121.9209]
								},
								{
									title : 'Chicago',
									content : 'This is the second best title in the world!',
									location : [41.8819, -87.6278]
								},
								{
									title : 'Los Angeles',
									content : 'This title is live!',
									location : [34.0500, -118.2500]
								},
								{
									title : 'Las Vegas',
									content : 'Sin City...\'nuff said!',
									location : [36.0800, -115.1522]
								},
								{
									title : 'Sunnyvale',
									content : 'Animal Shelter Volunteer April 18 1 pm - 4pm',
									location : [37.36, -121.886]
								},
								{
									title : 'San Jose',
									content : 'Women Who Code Volunteer April 18 9 AM-4pm',
									location : [37.37, -121.92]
								},
								{
									title : 'San Jose',
									content : 'American Red Cross Blood donation Volunteer April 18 2 pm - 4 pm',
									location : [37.3708, -121.96]
								},
								{
									title : 'San Jose',
									content : 'Environmental Volunteer',
									location : [37.34, -121.947]
								},
								{
									title : 'Sunnyvale',
									content : 'Raft Volunteer ',
									location : [37.34, -121.947]
								},
								{
									title : 'International Travel',
									content : 'Raft Volunteer ',
									location : [36.703660, 98.964844]
								}
								];

    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

		var latlngbounds = new google.maps.LatLngBounds();

    var createMarker = function (info){

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.latitude, info.longitude),
            title: info.title
        });
        marker.content = '<div class="infoWindowContent">' + info.content + '</div>';

				// fit this marker in the map
				var myLatLng = new google.maps.LatLng(info.latitude, info.longitude);
				latlngbounds.extend(myLatLng);

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);

    };

    for (var i = 0; i < data.length; i++){
        createMarker(data[i]);
    }

		$scope.map.setCenter(latlngbounds.getCenter());
		$scope.map.fitBounds(latlngbounds);

		var input = document.getElementsByClassName('zipcode-input')[0];
		var searchBox = new google.maps.places.SearchBox((input));


    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };

		google.maps.event.addListener(searchBox, 'places_changed', function() {
			var places = searchBox.getPlaces();

			if (places.length == 0) {
				return;
			}

			var longitude = places[0].geometry.location.lng(),
					latitude = places[0].geometry.location.lat();
			$scope.map.setCenter(new google.maps.LatLng(latitude, longitude));
			$scope.map.setZoom(6);
		});
	}
]);
