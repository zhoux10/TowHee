'use strict';

// Configuring the Articles module
angular.module('maps').run(['Menus',
	function(Menus) {
		Menus.addSubMenuItem('topbar', 'maps', 'View Events', '/maps');
		
	}
]);