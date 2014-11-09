BSS.modules.define(".stylesManager", null, function () {
	"use strict";

	var _styleElem = BSS.head.appendChild(BSS.document.createElement("STYLE"));

	return {
		include: function (cssImportString) {
			if (-1 === _styleElem.innerHTML.indexOf(cssImportString)) {
				_styleElem.innerHTML += cssImportString;
			}
		},
		exclude: function (cssImportString) {
			_styleElem.innerHTML = _styleElem.innerHTML.replace(cssImportString, "");
		}
	};
});