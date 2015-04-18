'use strict';

// Setting up route
angular.module('maps').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/maps',
			templateUrl: 'modules/maps/views/list-maps.client.view.html'
		}).
		state('createArticle', {
			url: '/maps/create',
			templateUrl: 'modules/maps/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/maps/:articleId',
			templateUrl: 'modules/maps/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/maps/:articleId/edit',
			templateUrl: 'modules/maps/views/edit-article.client.view.html'
		});
	}
]);
