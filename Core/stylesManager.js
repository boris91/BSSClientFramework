BSS.modules.define("core.stylesManager", null, function BSS$core$modules$define_moduleGetter_stylesManager () {
	"use strict";

	var _styleElem = BSS.head.appendChild(BSS.document.createElement("STYLE"));

	return {
		include: function BSS$core$stylesManager$include (cssImportString) {
			if (-1 === _styleElem.innerHTML.indexOf(cssImportString)) {
				_styleElem.innerHTML += cssImportString;
			}
		},
		exclude: function BSS$core$stylesManager$exclude (cssImportString) {
			_styleElem.innerHTML = _styleElem.innerHTML.replace(cssImportString, "");
		}
	};
});