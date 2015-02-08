(function (__win, __bssGlobalName, __coreNamespace, __coreModules) {
	"use strict";

	var __doc, __head, __bss, __bssModules, __jsScript;

	
	
	if (__win.hasOwnProperty(__bssGlobalName)) {
		return;
	}

	__doc = __win.document;
	__head = __doc.head;
	__jsScript = __doc.getElementById('mainScript');
	if (__jsScript) {
		var __jsScriptsSrc = __jsScript.getAttribute('src').replace(__bssGlobalName + '.js', '');
	}
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
				return __jsScriptsSrc + moduleFullNameWithNamespace.replace(/\./g, "/") + "." + fileExt;
			},
			_fetchModuleFileContent = function (moduleFullName, fileExt, onSuccess) {
				var xhr = new __win.XMLHttpRequest(),
					errorInfoContainer;
				xhr.open("GET", _getModuleFilePath(moduleFullName, fileExt), false);
				xhr.send(null);
				if (200 === xhr.status) {
					onSuccess(xhr.responseText);
				} else {
					errorInfoContainer = __doc.createElement("IFRAME");
					errorInfoContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999;");
					__doc.body.appendChild(errorInfoContainer);
					errorInfoContainer.contentDocument.write(xhr.responseText);
				}
			},
			_loaders = {
				css: function (stylesheetFullName) {
					_registerModule(stylesheetFullName, "@import url(" + _getModuleFilePath(stylesheetFullName, "css") + ");");
				},
				html: function (templateFullName) {
					_fetchModuleFileContent(templateFullName, "html", function (templateString) {
						_registerModule(templateFullName, __bss.templateEngine(templateString));
					});
				},
				js: function (moduleFullName) {
					_fetchModuleFileContent(moduleFullName, "js", function (moduleContent) {
						(new __win.Function(moduleContent)).call(__win);
					});
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
					callbackArgs = [],
					getEachModuleCallback = function () {
						return callback && function (module) {
							callbackArgs.push(module);
						} || null;
					},
					i;

				for (i = 0; i < modulesCount; i++) {
					_loadModule(modulesFullNames[i], getEachModuleCallback());
				}

				if (callback) {
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

	__win.Object.defineProperty(__win, __bssGlobalName, {
		writable: false,
		value: __bss
	});

	// +++ require core modules +++
	__bssModules.registerNamespace("", __coreNamespace);
	__bssModules.require(__coreModules);
	// --- require core modules ---
})(window, "BSS", "Core", [
	".routes",
	".ajax",
	".templateEngine",
	".keyCodes",
	".idsGenerator",
	".stylesManager",
	".mediator"
]);