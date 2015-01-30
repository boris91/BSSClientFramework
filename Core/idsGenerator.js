BSS.modules.define(".idsGenerator", null, function BSS$modules$define_moduleGetter_idsGenerator () {
	"use strict";

	var _idLength = 32,
		_portionCount = 100,
		_ids = [],
		CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		CHARS_COUNT = CHARS.length,
		_simpleCounter = -1,
		_generateGuid = function BSS$modules$idsGenerator$_generateGuid () {
			var id = "",
				i;
			for (i = 0; i < _idLength; i++) {
				id += CHARS[Math.floor(Math.random() * CHARS_COUNT)];
			}
			_ids[_ids.length] = id;
		},
		_generatePortion = function BSS$modules$idsGenerator$_generatePortion (portionCount) {
			var i;
			portionCount = portionCount || _portionCount;
			for (i = 0; i < portionCount; i++) {
				_generateGuid();
			}
		};

	_generatePortion(1000);

	return {
		setIdLength: function BSS$modules$idsGenerator$setIdLength (value) {
			_idLength = value;
		},
		setPortionCount: function BSS$modules$idsGenerator$setPortionCount (value) {
			_portionCount = value;
		},
		getIdForDomElement: function BSS$modules$idsGenerator$getIdForDomElement (prefix) {
			return prefix ? prefix + "_" + (++_simpleCounter) : (++_simpleCounter);
		},
		getId: function BSS$modules$idsGenerator$getId () {
			if (1 === _ids.length) {
				_generatePortion();
			}
			return _ids.pop();
		},
		getRange: function BSS$modules$idsGenerator$getRange (count) {
			count = ("number" === typeof count && count > 0) ? count : _portionCount;
			if (count > _ids.length) {
				_generatePortion(count - _ids.length + 1);
			}
			return _ids.splice(_ids.length - count, count);
		}
	};
});