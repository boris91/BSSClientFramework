BSS.modules.define("core.mvvmBinder",
	[
		"core.idsGenerator",
		"core.mediator"
	],
	function (BSS$core$idsGenerator, BSS$core$mediator) {
		"use strict";
		return function BSS$core$mvvmBinder () {
			var _unbinders = {},
				_bindSubsToPubs = function BSS$core$mvvmBinder$_bindSubsToPubs (subscribers, publishers, bindingMap) {
					//TODO: implement
				},
				_unbindSubsFromPubs = function BSS$core$mvvmBinder$_unbindSubsFromPubs (subscribers, publishers, bindingMap) {
					//TODO: implement
				};

			return {
				bind: function BSS$core$mvvmBinder$bind (models, views, modelToViewBindingMap, viewToModelBindingMap) {
					var id = BSS$core$idsGenerator.getId();

					_bindSubsToPubs(models, views, modelToViewBindingMap);
					_bindSubsToPubs(views, models, viewToModelBindingMap);

					_unbinders[id] = function BSS$core$mvvmBinder$_unbindExecuter () {
						_unbindSubsFromPubs(views, models, modelToViewBindingMap);
						_unbindSubsFromPubs(models, views, viewToModelBindingMap);
					};

					return id;
				},
				unBind: function BSS$core$mvvmBinder$unBind (id) {
					var unbinder = _unbinders[id];
					if ("function" === typeof unbinder) {
						unbinder();
						delete _unbinders[id];
					}
				}
			};
		};
});