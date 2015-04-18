'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('events').factory('Events', ['$resource',
	function($resource) {
		return $resource('events/:eventId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);