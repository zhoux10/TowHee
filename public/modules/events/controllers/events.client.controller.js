'use strict';

// Events controller
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events', '$http',
	function($scope, $stateParams, $location, Authentication, Events, $http) {
		$scope.authentication = Authentication;

		// Edit event
		$scope.setupEditForm = function () {
			$scope.findOne();
			$scope.setUpGooglePlaces();
		};

		// Create new Event
		$scope.setUpGooglePlaces = function () {
			var	input = document.getElementById('place');
			if(input) {
				$scope.searchBox = new google.maps.places.SearchBox(input);
			}
		};

		$scope.create = function() {

			var googlePlaces = $scope.searchBox.getPlaces(),
	         location;

	      	if(googlePlaces) {
	      		var longitude = googlePlaces[0].geometry.location.lng(),
							latitude = googlePlaces[0].geometry.location.lat();
					location = [longitude, latitude];
			   }

				// Create new Event object
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

		// Remove existing Event
		$scope.remove = function(eventmodel) {
			if (eventmodel) {
				eventmodel.delete(eventmodel._id);

				for (var i in $scope.eventmodels) {
					if ($scope.eventmodels[i] === eventmodel) {
						$scope.eventmodels.splice(i, 1);
					}
				}
			} else {
				$scope.delete($scope.eventmodel._id);
			}
			$location.path('maps/view');
		};

		$scope.delete = function (eventId) {
			$http.delete('/events/' + eventId)
            .success(function(data) {
							console.log('Success: ' + data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
		};

		// Update existing Event
		$scope.update = function() {
			var eventmodel = $scope.eventmodel;

			$http.post('/events/' + eventmodel._id, {body: eventmodel})
					 .success(function() {
							$location.path('events/' + eventmodel._id);
						})
					 .error(function (errorResponse) {
							$scope.error = errorResponse.data.message;
					 });
		};

		// Find a list of Events
		$scope.find = function() {
			$scope.events = Events.query();
		};

		// Find existing Event
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
			infoWindow.setContent("<a href='https://www.google.com/maps/dir/Current+Location/" + latitude + "," + longitude + "' id='infoWindowContent'>Directions to " + title + "</a>");
			infoWindow.open($scope.map, marker);
		};
	}
]);
