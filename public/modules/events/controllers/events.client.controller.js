'use strict';

// Articles controller
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events',
	function($scope, $stateParams, $location, Authentication, Events) {
		$scope.authentication = Authentication;
		var	searchBox;
		// Create new Article
		$scope.create = function() {

			var googlePlaces = searchBox.getPlaces(),
	         location;

	      	if(googlePlaces) {
	      		var longitude = googlePlaces[0].geometry.location.lng(),
							latitude = googlePlaces[0].geometry.location.lat();
					location = [longitude, latitude];
			   }

				// Create new Article object
				console.log(this);
				var eventmodel = new Events({
					title: this.title,
					content: this.content,
					location: location,
					day: this.day,
					imageUrl: this.imageUrl,
					signupUrl: this.signupUrl
				});


				// Redirect after save
				eventmodel.$save(function(response) {
					$location.path('events/' + response._id);

					// Clear form fields
					$scope.title = '';
					$scope.content = '';
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
		};

		// Remove existing Article
		$scope.remove = function(eventmodel) {
			if (eventmodel) {
				eventmodel.$remove();

				for (var i in $scope.eventmodels) {
					if ($scope.eventmodels[i] === eventmodel) {
						$scope.eventmodels.splice(i, 1);
					}
				}
			} else {
				$scope.eventmodel.$remove(function() {
					$location.path('eventmodels');
				});
			}
		};

		// Update existing Article
		$scope.update = function() {
			var eventmodel = $scope.eventmodel;

			eventmodel.$update(function() {
				$location.path('events/' + eventmodel._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Articles
		$scope.find = function() {
			$scope.events = Events.query();
		};

		// Find existing Article
		$scope.findOne = function() {
			$scope.eventmodel = Events.get({
				eventId: $stateParams.eventId
			}, function (event) {
				$scope.createMap(event);
			});
		};

		$scope.createMap = function(event) {
			var longitude = event.location[0],
					latitude = event.location[1],
					mapOptions = {
						zoom: 12,
						center: new google.maps.LatLng(latitude, longitude),
						mapTypeId: google.maps.MapTypeId.TERRAIN
					};

			$scope.map = new google.maps.Map(document.getElementById('event-map'), mapOptions);
			$scope.createMarker(longitude, latitude, event.title);
		};

		$scope.createMarker = function (longitude, latitude, title){
	    var infoWindow = new google.maps.InfoWindow();
			var marker = new google.maps.Marker({
				map: $scope.map,
				position: new google.maps.LatLng(latitude, longitude),
			});
			infoWindow.setContent("<a href='https://www.google.com/maps/dir/Current+Location/" + latitude + "," + longitude + "' id='infoWindowContent'>Get Directions to " + title + "</a>");
			infoWindow.open($scope.map, marker);
		};
	}
]);
