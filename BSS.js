(function (win, basicDeps) {
	var _doc = win.document,
		_head = _doc.head,
		_bss = {},
		_bssModules = (function () {
			var _defined = {},
				_callbacks = {},
				_getFilePath = function (moduleFullName, fileExt) {
					return moduleFullName.replace(/\./g, "/") + "." + fileExt;
				},
				_isModuleAnHtmlTemplate = function (moduleFullName) {
					return (0 === moduleFullName.indexOf("HTML:"));
				},
				_loadHtmlTemplate = function (templateFullName) {
					var iframeElem = document.createElement("IFRAME");
					iframeElem.setAttribute("style", "position: absolute; left: 0px; top: 0px; width: 0px; height: 0px; visibility: hidden;");
					iframeElem.setAttribute("src", _getFilePath(templateFullName, "html"));
					iframeElem.addEventListener("load", function () {
						var templateString = iframeElem.contentWindow.document.body.innerHTML,
							htmlTemplateEngine = BSS.templateEngine(templateString);
						_head.removeChild(iframeElem);
						_registerModule(templateFullName, htmlTemplateEngine);
					}, false);
					_head.appendChild(iframeElem);
				},
				_loadJs = function (moduleFullName) {
					var scriptElem = _doc.createElement("SCRIPT");
					scriptElem.setAttribute("type", "text/javascript");
					scriptElem.setAttribute("charset", "utf-8");
					scriptElem.addEventListener("load", function () {
						_head.removeChild(scriptElem);
					}, false);
					scriptElem.setAttribute("src", _getFilePath(moduleFullName, "js"));
					_head.appendChild(scriptElem);
				},
				_loadModule = function (moduleFullName, callback) {
					var loadExecuter = _loadJs;

					if (_isModuleAnHtmlTemplate(moduleFullName)) {
						moduleFullName = moduleFullName.substr(5);
						loadExecuter = _loadHtmlTemplate;
					}

					if (!_defined[moduleFullName]) {
						if (callback) {
							_callbacks[moduleFullName] = callback;
						}

						loadExecuter(moduleFullName);
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
									callback.apply(win, callbackArgs);
								}
							} || null;
						},
						i;

					for (i = 0; i < modulesCount; i++) {
						_loadModule(modulesFullNames[i], getEachModuleCallback(i));
					}

					if (callback && 0 === modulesCount) {
						callback.apply(win, callbackArgs);
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
						if (!parentObj[ancestorName]) {
							Object.defineProperty(parentObj, ancestorName, {
								writable: false,
								value: {}
							});
						}
						parentObj = parentObj[ancestorName];
					}

					Object.defineProperty(parentObj, moduleName, {
						writable: false,
						value: module
					});

					if (callback) {
						delete _callbacks[moduleFullName];
						callback(module);
					}
				};

			return {
				define: function (moduleFullName, deps, moduleGetter) {
					if (!_defined[moduleFullName]) {
						_defined[moduleFullName] = true;
						_loadModules(deps, function () {
							var moduleCtor = moduleGetter.apply(win, arguments);
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

	_bssModules.require(basicDeps, function () {
		_bssModules_preloadFake.requireDeferred();
		Object.defineProperty(_bss, "modules", {
			writable: false,
			value: _bssModules
		});
	});

	Object.defineProperties(_bss, {
		"window": {
			writable: false,
			value: win
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

	Object.defineProperty(win, "BSS", {
		writable: false,
		value: _bss
	});
})(window, [
	"routes",
	"ajax",
	"templateEngine",
	"keys",
	"identifiers"
]);