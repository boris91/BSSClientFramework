(function (win, basicDeps) {
	var _doc = win.document,
		_head = _doc.head,
		_bss = {},
		_bssModulesNsSeparator = "/",
		_bssModules = (function () {
			var _defined = {},
				_callbacks = {},
				_loadModule = function (moduleFullName, callback) {
					var scriptElem;
					if (!_defined[moduleFullName]) {
						if (callback) {
							_callbacks[moduleFullName] = callback;
						}

						scriptElem = _doc.createElement("SCRIPT");
						scriptElem.setAttribute("type", "text/javascript");
						scriptElem.setAttribute("charset", "utf-8");
						scriptElem.addEventListener("load", function () {
							_head.removeChild(scriptElem);
						}, false);
						scriptElem.setAttribute("src", moduleFullName + ".js");
						_head.appendChild(scriptElem);
					}
				},
				_loadModules = function (modulesFullNames, callback) {
					var modulesCount = modulesFullNames && modulesFullNames.length || 0,
						loadedModulesCount = 0,
						callbackArgs = [],
						getEachModuleCallback = function (index) {
							return callback && function (moduleCtor) {
								callbackArgs[index] = moduleCtor;
								++loadedModulesCount;
								if (loadedModulesCount === modulesCount) {
									callback(callbackArgs);
								}
							} || null;
						},
						i;

					for (i = 0; i < modulesCount; i++) {
						_loadModule(modulesFullNames[i], getEachModuleCallback(i));
					}

					if (callback && 0 === modulesCount) {
						callback(callbackArgs);
					}
				},
				_registerModule = function (module, moduleFullName, moduleArgs) {
					var modulePathChain = moduleFullName.split(_bssModulesNsSeparator),
						ancestorsCount = modulePathChain.length - 1,
						moduleName = modulePathChain[ancestorsCount],
						parentObj = _bss,
						moduleCtor = module.apply(win, moduleArgs),
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
						value: moduleCtor
					});

					if (callback) {
						delete _callbacks[moduleFullName];
						callback(moduleCtor);
					}
				};

			return {
				namespacesSeparator: _bssModulesNsSeparator,
				define: function (deps, moduleFullName, module) {
					if (!_defined[moduleFullName]) {
						_defined[moduleFullName] = true;
						_loadModules(deps, function (moduleArgs) {
							_registerModule(module, moduleFullName, moduleArgs);
						});
					}
				},
				require: function (requiredCode, callback) {
					var requireExecuter = ("string" === typeof requiredCode) ? _loadModule : _loadModules;
					requireExecuter(requiredCode, callback);
				}
			};
		})();

	_bssModules.require(basicDeps);

	Object.defineProperty(_bss, "modules", {
		writable: false,
		value: _bssModules
	});

	Object.defineProperty(win, "BSS", {
		writable: false,
		value: _bss
	});
})(window);