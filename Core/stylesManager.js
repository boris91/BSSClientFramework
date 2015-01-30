BSS.modules.define(".stylesManager", null, function BSS$modules$define_moduleGetter_stylesManager () {
	"use strict";

	var _styleElem = BSS.head.appendChild(BSS.document.createElement("STYLE"));

	return {
		include: function BSS$stylesManager$include (cssImportString) {
			if (-1 === _styleElem.innerHTML.indexOf(cssImportString)) {
				_styleElem.innerHTML += cssImportString;
			}
		},
		exclude: function BSS$stylesManager$exclude (cssImportString) {
			_styleElem.innerHTML = _styleElem.innerHTML.replace(cssImportString, "");
		}
	};
});