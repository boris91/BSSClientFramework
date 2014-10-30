(function (__win, __bssGlobalName, __coreNamespace, __coreModules) {
	var __doc, __head, __bss, __bssModules;

	__win = __win || window;
	__bssGlobalName = __bssGlobalName || "BSS";
	__coreNamespace = __coreNamespace || "";
	__coreModules = __coreModules || [];

	if (__win.hasOwnProperty(__bssGlobalName)) {
		return;
	}

	__doc = __win.document;
	__head = __doc.head;
	__bss = {};
	__bssModules = (function () {
		var _definedModules = {},
			_registeredNamespaces = {},
			_callbacks = {},
			_getModuleNameWithNamespace = function (moduleFullName) {
				var modulePathChain = moduleFullName.split("."),
					nsName;
				for (nsName in _registeredNamespaces) {
					if (nsName === modulePathChain[0]) {
						modulePathChain[0] = _registeredNamespaces[nsName];
						moduleFullName = modulePathChain.join(".");
						break;
					}
				}
				return moduleFullName;
			},
			_getModuleFilePath = function (moduleFullName, fileExt) {
				var moduleFullNameWithNamespace = _getModuleNameWithNamespace(moduleFullName);
				return moduleFullNameWithNamespace.replace(/\./g, "/") + "." + fileExt;
			},
			_jsLoaderXhrCallbacks = {
				onSuccess: function (moduleContent) {
					var execModuleDefinition = new __win.Function("BSS", moduleContent);
					execModuleDefinition.call(__win, __bss);
				},
				onError: function (errorInfo) {
					var errorInfoContainer = __doc.createElement("IFRAME");
					errorInfoContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999;");
					__doc.body.appendChild(errorInfoContainer);
					errorInfoContainer.contentDocument.write(errorInfo);
				}
			},
			_loaders = {
				css: function (stylesheetFullName) {
					_registerModule(stylesheetFullName, "@import url(" + _getModuleFilePath(stylesheetFullName, "css") + ");");
				},
				html: function (templateFullName) {
					var iframeElem = __doc.createElement("IFRAME");
					iframeElem.setAttribute("style", "position: absolute; left: 0px; top: 0px; width: 0px; height: 0px; visibility: hidden;");
					iframeElem.setAttribute("src", _getModuleFilePath(templateFullName, "html"));
					iframeElem.addEventListener("load", function () {
						var templateString = iframeElem.contentWindow.document.body.innerHTML,
							htmlTemplateEngine = __bss.templateEngine(templateString);
						__head.removeChild(iframeElem);
						_registerModule(templateFullName, htmlTemplateEngine);
					}, false);
					__head.appendChild(iframeElem);
				},
				js: function (moduleFullName) {
					var xhr = new __win.XMLHttpRequest();
					xhr.open("GET", _getModuleFilePath(moduleFullName, "js"), false);
					xhr.send(null);
					_jsLoaderXhrCallbacks[(200 === xhr.status) ? "onSuccess" : "onError"](xhr.responseText);
				}
			},
			_loadModule = function (moduleFullName, callback) {
				var loader = _loaders.js,
					loaderName;

				for (loaderName in _loaders) {
					if (0 === moduleFullName.indexOf(loaderName.toUpperCase() + ":")) {
						moduleFullName = moduleFullName.substr(loaderName.length + 1);
						loader = _loaders[loaderName];
						break;
					}
				}

				if (!_definedModules[moduleFullName]) {
					if (callback) {
						_callbacks[moduleFullName] = callback;
					}

					loader(moduleFullName);
				}
			},
			_loadModules = function (modulesFullNames, callback) {
				var modulesCount = modulesFullNames && modulesFullNames.length || 0,
					loadedModulesCount = 0,
					callbackArgs = [],
					getEachModuleCallback = function (index) {
						return callback && function (module) {
							callbackArgs[index] = module;
							++loadedModulesCount;
							if (loadedModulesCount === modulesCount) {
								callback.apply(__win, callbackArgs);
							}
						} || null;
					},
					i;

				for (i = 0; i < modulesCount; i++) {
					_loadModule(modulesFullNames[i], getEachModuleCallback(i));
				}

				if (callback && 0 === modulesCount) {
					callback.apply(__win, callbackArgs);
				}
			},
			_registerModule = function (moduleFullName, module) {
				var modulePathChain = moduleFullName.split("."),
					ancestorsCount = modulePathChain.length - 1,
					moduleName = modulePathChain[ancestorsCount],
					parentObj = __bss,
					callback = _callbacks[moduleFullName],
					i, ancestorName;

				for (i = 0; i < ancestorsCount; i++) {
					ancestorName = modulePathChain[i];
					if (ancestorName) {
						if (!parentObj[ancestorName]) {
							__win.Object.defineProperty(parentObj, ancestorName, {
								writable: false,
								value: {}
							});
						}
						parentObj = parentObj[ancestorName];
					}
				}

				__win.Object.defineProperty(parentObj, moduleName, {
					writable: false,
					value: module
				});

				if (callback) {
					delete _callbacks[moduleFullName];
					callback(module);
				}
			};

		return {
			registerNamespace: function (name, path) {
				_registeredNamespaces[name] = path;
			},
			define: function (moduleFullName, deps, moduleGetter) {
				if (!_definedModules[moduleFullName]) {
					_definedModules[moduleFullName] = true;
					_loadModules(deps, function () {
						var moduleCtor = moduleGetter.apply(__win, arguments);
						_registerModule(moduleFullName, moduleCtor);
					});
				}
			},
			require: function (requiredCode, callback) {
				var requireExecuter = ("string" === typeof requiredCode) ? _loadModule : _loadModules;
				requireExecuter(requiredCode, callback);
			}
		};
	})();

	__win.Object.defineProperties(__bss, {
		"window": {
			writable: false,
			value: __win
		},
		"document": {
			writable: false,
			value: __doc
		},
		"head": {
			writable: false,
			value: __head
		},
		"modules": {
			writable: false,
			value: __bssModules
		}
	});

	// +++ require core modules +++
	__bssModules.registerNamespace("", __coreNamespace);
	__bssModules.require(__coreModules);
	// --- require core modules ---

	__win.Object.defineProperty(__win, __bssGlobalName, {
		writable: false,
		value: __bss
	});
})(window, "BSS", "Core", [
	".routes",
	".ajax",
	".templateEngine",
	".keyCodes",
	".idsGenerator",
	".stylesManager"
]);