BSS.modules.define("components.product.view",
[
	"HTML:components.product.template",
	"CSS:components.product.styles",
	"core.stylesManager",
	"core.dom"
], function BSS$modules$define_moduleGetter_components$product$view (BSS$components$product$template, BSS$components$product$styles, BSS$core$stylesManager, BSS$core$dom) {
	"use strict";
	var _htmlContainer = null,
		_newLineNode = BSS$core$dom.create("br");

	return {
		clear: function BSS$components$product$view$clear () {
			if (_htmlContainer) {
				_htmlContainer.innerHTML = "";
			}
		},
		render: function BSS$components$product$view$render (models, htmlContainer) {
			var modelsCount = models.length,
				i;

			if (htmlContainer !== _htmlContainer) {
				BSS$core$stylesManager.include(BSS$components$product$styles);
				_htmlContainer = htmlContainer;
			}

			for (i = 0; i < modelsCount; i++) {
				BSS$components$product$template(models[i], _htmlContainer);
				BSS$core$dom.copy(_newLineNode, _htmlContainer, true);
			}
			BSS$core$dom.copy(_newLineNode, _htmlContainer, true);
		}
	};
});