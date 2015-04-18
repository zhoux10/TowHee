'use strict';

// Articles controller
angular.module('events').controller('EventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Events',
	function($scope, $stateParams, $location, Authentication, Events) {
		$scope.authentication = Authentication;

		// Create new Article
		$scope.create = function() {
			// Create new Article object
			var eventmodel = new Events({
				title: this.title,
				content: this.content
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
			});
		};
	}
]);