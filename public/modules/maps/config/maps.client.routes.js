'use strict';

// Setting up route
angular.module('maps').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('viewEventMap', {
			url: '/maps/view',
			templateUrl: 'modules/maps/views/view-maps.client.view.html'
		});
	}
]);