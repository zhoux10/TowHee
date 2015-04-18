'use strict';

// Maps controller
angular.module('maps').controller('MapsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Maps',
	function($scope, $stateParams, $location, Authentication, Maps) {
		$scope.authentication = Authentication;
		var data = $http.get(‘json/my.json’).success(function(data,status){  // get data and status of it
			console.log(data);
			$scope.formdata = data;
	}
]);
