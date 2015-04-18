'use strict';

// Articles controller
angular.module('maps').controller('MapsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Maps) {
		$scope.authentication = Authentication;

		var data = [{
									title : 'Sunnyvale',
									content : 'Animal Shelter Volunteer April 18 2015 10 am - 4 pm , http://www.animalshelter.org',
									latitude : 37.36,
									longitude : -121.886
								},
								{
									title : 'San Jose',
									content : 'Women Who Code Volunteer',
									latitude : 37.3760,
									longitude : -121.9209
								},
								{
									title : 'Chicago',
									content : 'This is the second best city in the world!',
									latitude : 41.8819,
									longitude : -87.6278
								},
								{
									title : 'Los Angeles',
									content : 'This city is live!',
									latitude : 34.0500,
									longitude : -118.2500
								},
								{
									title : 'Las Vegas',
									content : 'Sin City...\'nuff said!',
									latitude : 36.0800,
									longitude : -115.1522
								}];

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
