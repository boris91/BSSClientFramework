(function (_win, _coreNamespace, _coreModules) {
	var _doc = _win.document,
		_head = _doc.head,
		_bss = {},
		_bssModules = (function () {
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
				_loaders = {
					css: function (stylesheetFullName) {
						_registerModule(stylesheetFullName, "@import url(" + _getModuleFilePath(stylesheetFullName, "css") + ");");
					},
					html: function (templateFullName) {
						var iframeElem = _doc.createElement("IFRAME");
						iframeElem.setAttribute("style", "position: absolute; left: 0px; top: 0px; width: 0px; height: 0px; visibility: hidden;");
						iframeElem.setAttribute("src", _getModuleFilePath(templateFullName, "html"));
						iframeElem.addEventListener("load", function () {
							var templateString = iframeElem.contentWindow.document.body.innerHTML,
								htmlTemplateEngine = BSS.templateEngine(templateString);
							_head.removeChild(iframeElem);
							_registerModule(templateFullName, htmlTemplateEngine);
						}, false);
						_head.appendChild(iframeElem);
					},
					js: function (moduleFullName) {
						var scriptElem = _doc.createElement("SCRIPT");
						scriptElem.setAttribute("type", "text/javascript");
						scriptElem.setAttribute("charset", "utf-8");
						scriptElem.addEventListener("load", function () {
							_head.removeChild(scriptElem);
						}, false);
						scriptElem.setAttribute("src", _getModuleFilePath(moduleFullName, "js"));
						_head.appendChild(scriptElem);
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
									callback.apply(_win, callbackArgs);
								}
							} || null;
						},
						i;

					for (i = 0; i < modulesCount; i++) {
						_loadModule(modulesFullNames[i], getEachModuleCallback(i));
					}

					if (callback && 0 === modulesCount) {
						callback.apply(_win, callbackArgs);
					}
				},
				_registerModule = function (moduleFullName, module) {
					var modulePathChain = moduleFullName.split("."),
						ancestorsCount = modulePathChain.length - 1,
						moduleName = modulePathChain[ancestorsCount],
						parentObj = _bss,
						callback = _callbacks[moduleFullName],
						i, ancestorName;

					for (i = 0; i < ancestorsCount; i++) {
						ancestorName = modulePathChain[i];
						if (ancestorName) {
							if (!parentObj[ancestorName]) {
								_win.Object.defineProperty(parentObj, ancestorName, {
									writable: false,
									value: {}
								});
							}
							parentObj = parentObj[ancestorName];
						}
					}

					_win.Object.defineProperty(parentObj, moduleName, {
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
							var moduleCtor = moduleGetter.apply(_win, arguments);
							_registerModule(moduleFullName, moduleCtor);
						});
					}
				},
				require: function (requiredCode, callback) {
					var requireExecuter = ("string" === typeof requiredCode) ? _loadModule : _loadModules;
					requireExecuter(requiredCode, callback);
				}
			};
		})(),
		_bssModules_preloadFake = (function () {
			var _argsForDeferred = [],
				_fakeRequireAllowed = true;

			return {
				registerNamespace: function (name, path) {
					_bssModules.registerNamespace.apply(_bssModules, arguments);
				},
				define: function (moduleFullName, deps, moduleGetter) {
					_bssModules.define.apply(_bssModules, arguments);
				},
				require: function (requiredCode, callback) {
					if (_fakeRequireAllowed) {
						_argsForDeferred[_argsForDeferred.length] = [requiredCode, callback];
					} else {
						_bssModules.require.apply(_bssModules, arguments);
					}
				},
				requireDeferred: function () {
					var argsForDeferredCount = _argsForDeferred.length,
						i;
					_fakeRequireAllowed = false;
					for (i = 0; i < argsForDeferredCount; i++) {
						_bssModules.require.apply(_bssModules, _argsForDeferred[i]);
					}
				}
			};
		})();

	_bssModules.registerNamespace("", _coreNamespace || "");
	_bssModules.require(_coreModules, function () {
		_bssModules_preloadFake.requireDeferred();
		_win.Object.defineProperty(_bss, "modules", {
			writable: false,
			value: _bssModules
		});
	});

	_win.Object.defineProperties(_bss, {
		"window": {
			writable: false,
			value: _win
		},
		"document": {
			writable: false,
			value: _doc
		},
		"head": {
			writable: false,
			value: _head
		},
		"modules": {
			writable: true,
			value: _bssModules_preloadFake
		}
	});

	_win.Object.defineProperty(_win, "BSS", {
		writable: false,
		value: _bss
	});
})(window, "Core", [
	".routes",
	".ajax",
	".templateEngine",
	".keyCodes",
	".idsGenerator",
	".stylesManager"
]);