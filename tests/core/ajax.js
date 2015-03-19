BSS.modules.define("tests.core.ajax",
	[
		"core.dom",
		"core.ajax",
		"components.product.model",
		"components.product.view"
		//"core.mvvmBinder",
		//"components.product.collection"
	], function (BSS$core$dom, BSS$core$ajax, BSS$components$product$model, BSS$components$product$view/*, BSS$components$product$collection */) {
		"use strict";
		var _routes = {
				GetProducts: "tests/httpHandlers/products/get.ashx",
				PostProducts: "tests/httpHandlers/products/post.ashx"
			},
			_dataFilePath = "../../data/products.json",
			_xhrParams = {
				GetProducts: {
					method: "GET",
					url: _routes.GetProducts,
					queryOptions: {
						filePath: _dataFilePath
					},
					headers: {
						"Accept": "application/json",
						"Content-Type": "application/json"
					},
					onSuccess: function (result) {
						//return BSS$components$product$collection.bind(result);

						var getProducts = function (xhrResult) {
								var products = xhrResult && xhrResult.products,
									productsCount = products.length,
									productModels = [],
									i, productData, productModel;

								for (i = 0; i < productsCount; i++) {
									productData = products[i];
									productModel = new BSS$components$product$model(productData);
									productModels.push(productModel);
								}

								return productModels;
							},
							showProducts = function (xhrResult) {
								var productModels = getProducts(xhrResult),
									productsContainer = BSS$core$dom.doc.createElement("DIV");

								BSS$core$dom.body.appendChild(productsContainer);
								BSS$components$product$view.render(productModels, productsContainer);
							};

						if ("complete" === BSS$core$dom.doc.readyState) {
							showProducts(result);
						} else {
							BSS.win.addEventListener("load", showProducts.bind(BSS.win, result), false);
						}
					},
					onError: function (errorInfo) {
						var errorInfoContainer = BSS$core$dom.doc.createElement("IFRAME");
						errorInfoContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999;");
						BSS$core$dom.body.appendChild(errorInfoContainer);
						errorInfoContainer.contentDocument.write(errorInfo);
					}
				},
				PostProducts: {
					method: "POST",
					url: _routes.PostProducts,
					queryOptions: {
						filePath: _dataFilePath
					},
					data: null,
					onSuccess: function (result) {
						alert("success");
					},
					onError: function (errorInfo) {
						var errorInfoContainer = BSS$core$dom.doc.createElement("IFRAME");
						errorInfoContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999;");
						BSS$core$dom.body.appendChild(errorInfoContainer);
						errorInfoContainer.contentDocument.write(errorInfo);
					}
				}
			},
			_copyXhrParams = function (routeName) {
				var xhrParamsSrc = _xhrParams[routeName],
					xhrParamsDst = {},
					paramName;

				for (paramName in xhrParamsSrc) {
					xhrParamsDst[paramName] = xhrParamsSrc[paramName];
				}

				return xhrParamsDst;
			};

		return {
			send: function (routeName, sync) {
				var xhrParams = _copyXhrParams(routeName),
					xhrResponse;

				xhrParams.async = !sync;

				xhrResponse = BSS$core$ajax.send(xhrParams);

				if (sync) {
					xhrParams[xhrResponse.success ? "onSuccess" : "onError"](xhrResponse.value);
				}
			}
		};
});