BSS.modules.define("core.stylesManager",
	[
		"core.dom"
	],
	function BSS$core$modules$define_moduleGetter_stylesManager (BSS$core$dom) {
		"use strict";

		var _styleElem = BSS$core$dom.create("STYLE");

		BSS$core$dom.head.insertBefore(_styleElem, BSS$core$dom.getFirst("script", BSS$core$dom.head));

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