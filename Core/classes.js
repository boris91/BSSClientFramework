BSS.modules.define("core.classes", null, function BSS$core$modules$define_moduleGetter_classes () {
	var _bssModules = BSS.modules,
		_Obj = BSS.Obj,
		BSS$core$classes = {
			declare: function BSS$core$classes$declare (name, superclassCtor, ctor, ctorProto, ctorOwnProps) {
				return _bssModules.define(name, null, function BSS$core$classes$declare_moduleGetter () {
					var propName;

					if (superclassCtor) {
						ctor = BSS$core$classes.inherit(ctor, superclassCtor);
					}

					ctor.prototype = ctorProto || {};

					if (undefined !== ctorOwnProps) {
						for (propName in ctorOwnProps) {
							ctor[propName] = ctorOwnProps[propName];
						}
					}

					return ctor;
				});
			},
			inherit: function BSS$core$classes$inherit (ctor, superclassCtor) {
				var newCtor = function () {
						this.__superclassCtor__.apply(this, arguments);
						return this.__ctor__.apply(this, arguments);
					},
					newCtorProto = newCtor.prototype = {},
					propName;

				newCtor.prototype = superclassCtor.prototype;//TODO: extend newCtor.prototype with props of superclassCtor.prototype
				newCtorProto.__superclassCtor__ = superclassCtor;
				newCtorProto.__ctor__ = ctor;

				for (propName in superclassCtor) {
					if (superclassCtor.hasOwnProperty(propName)) {
						newCtor[propName] = superclassCtor[propName];
					}
				}

				return newCtor;
			},
			extend: function BSS$core$classes$extend (targetObj, sourceObj) {
				var propName;
				for (propName in sourceObj) {
					if (sourceObj.hasOwnProperty(propName)) {
						targetObj[propName] = sourceObj[propName];
					}
				}
			},
			mix: function BSS$core$classes$mix (targetObj, sourceObjects) {
				var sourceObjectsCount = sourceObjects.length,
					i, sourceObj, propName;

				for (i = 0; i < sourceObjectsCount; i++) {
					sourceObj = sourceObjects[i];
					for (propName in sourceObj) {
						if (sourceObj.hasOwnProperty(propName) && !targetObj.hasOwnProperty(propName)) {
							targetObj[propName] = sourceObj[propName];
						}
					}
				}
			}
		};

	return BSS$core$classes;
});