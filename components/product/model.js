BSS.modules.require([
		"core.idsGenerator",
		"core.mediator"
	],
	function BSS$modules$define_moduleGetter_entities$product$model (BSS$core$idsGenerator, BSS$core$mediator) {
		"use strict";

		var _propsValidators = {
				id: function BSS$components$product$model$id (value) {
					return ("string" === typeof value) && (32 === value.length);
				},
				name: function BSS$components$product$model$name (value) {
					return ("string" === typeof value) && (0 < value.length);
				},
				age: function BSS$components$product$model$age (value) {
					return ("number" === typeof value) && (0 < value);
				},
				country: function BSS$components$product$model$country (value) {
					return ("string" === typeof value) && (0 < value.length);
				}
			},
			_isValidPropValue = function BSS$components$product$model$_isValidPropValue (propName, propValue) {
				return ("function" === typeof _propsValidators[propName]) ? _propsValidators[propName](propValue) : true;
			},
			BSS$components$product$model = BSS.core.classes.declare("components.product.model", null,
				function BSS$components$product$model (data) {
					if (data) {
						this.update(data);
					} else {
						this.name = "";
						this.age = 0;
						this.country = "";
						this.id = BSS$core$idsGenerator.getId();
					}

					this.selected = false;
				},
				{
					update: function BSS$components$product$model$update (data) {
						var propName, propValue;
						for (propName in data) {
							propValue = data[propName];
							if (_isValidPropValue(propName, propValue)) {
								this[propName] = propValue;
							}
						}
						this.publish("components.product.model.onUpdate::" + this.id);
					},
					toggleSelection: function BSS$components$product$model$toggleSelection (event) {
						if (1 === event.which) {// left mouse button pressed
							this.selected = !this.selected;
							this.publish("components.product.model.onToggleSelection::" + this.id, this.selected);
						}
						event.preventDefault();
						event.stopPropagation();
					}
				});

			BSS.core.classes.extend(BSS$components$product$model.prototype, new BSS$core$mediator());

			return BSS$components$product$model;
});