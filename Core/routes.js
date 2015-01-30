BSS.modules.define(".routes", null, function BSS$modules$define_moduleGetter_routes () {
	"use strict";

	var _bssRoutes = {},
		routesSet = {
			/*
				place routes here,
				for example:
				"GetUsers": "home/users/list"
			*/
		},
		routeName;

	for (routeName in routesSet) {
		BSS.window.Object.defineProperty(_bssRoutes, routeName, {
			writable: false,
			value: routesSet[routeName]
		});
	}

	BSS.window.Object.preventExtensions(_bssRoutes);

	return _bssRoutes;
});