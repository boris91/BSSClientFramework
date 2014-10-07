(function (win, basicDeps) {
	var _doc = win.document,
		_head = _doc.head,
		_bss = {},
		_bssModulesNsSeparator = "/",
		_bssModules = (function () {
			var _defined = {},
				_callbacks = {},
				_depsLoadedCallback = function (module, moduleFullName, moduleArgs) {
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
					var depsCount = deps && deps.length || 0,
						readyDepsCount = 0,
						moduleArgs = [],
						getModuleArgSetter = function (index) {
							return function (value) {
								moduleArgs[index] = value;
								++readyDepsCount;
								if (readyDepsCount === depsCount) {
									_depsLoadedCallback(module, moduleFullName, moduleArgs);
								}
							};
						},
						i;

					if (!_defined[moduleFullName]) {
						_defined[moduleFullName] = true;
						if (depsCount) {
							for (i = 0; i < depsCount; i++) {
								this.require(deps[i], getModuleArgSetter(i));
							}
						} else {
							_depsLoadedCallback(module, moduleFullName, moduleArgs);
						}
					}
				},
				require: function (moduleFullName, callback) {
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
				}
			};
		})(),
		basicDepsCount = basicDeps && basicDeps.length || 0,
		j;

	for (j = 0; j < basicDepsCount; j++) {
		_bssModules.require(basicDeps[j]);
	}

	Object.defineProperty(_bss, "modules", {
		writable: false,
		value: _bssModules
	});

	Object.defineProperty(win, "BSS", {
		writable: false,
		value: _bss
	});
})(window, [
	"mvc",
	"ui",
	"events",
	"exceptions",
	"ajax",
	"validation"
]);