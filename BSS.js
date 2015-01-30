(function IIFE$BSS (__win, __bssGlobalName, __coreNamespace, __coreModules, __mainScriptId) {
	"use strict";

	var __doc, __head, __bss, __bssModules, __jsCommonPath;

	
	if (__win.hasOwnProperty(__bssGlobalName)) {
		return;
	}

	__doc = __win.document;
	__head = __doc.head;
	__jsCommonPath = (__mainScriptId && __doc.getElementById(__mainScriptId) || { getAttribute: function mainScriptFakeObj$getAttribute () { return ""; } }).getAttribute("src").replace(__bssGlobalName + ".js", "") || "";
	__bss = {};
	__bssModules = (function IIFE$BSS$modules () {
		var _definedModules = {},
			_registeredNamespaces = {},
			_callbacks = {},
			_getModuleNameWithNamespace = function BSS$modules$_getModuleNameWithNamespace (moduleFullName) {
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
			_getModuleFilePath = function BSS$modules$_getModuleFilePath (moduleFullName, fileExt) {
				var moduleFullNameWithNamespace = _getModuleNameWithNamespace(moduleFullName);
				return __jsCommonPath + moduleFullNameWithNamespace.replace(/\./g, "/") + "." + fileExt;
			},
			_fetchModuleFileContent = function BSS$modules$_fetchModuleFileContent (moduleFullName, fileExt, onSuccess) {
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
				css: function BSS$modules$_loaders$css (stylesheetFullName) {
					_registerModule(stylesheetFullName, "@import url(" + _getModuleFilePath(stylesheetFullName, "css") + ");");
				},
				html: function BSS$modules$_loaders$html (templateFullName) {
					_fetchModuleFileContent(templateFullName, "html", function BSS$modules$_fetchModuleFileContent_onSuccess (templateString) {
						_registerModule(templateFullName, __bss.templateEngine(templateString));
					});
				},
				js: function BSS$modules$_loaders$js (moduleFullName) {
					_fetchModuleFileContent(moduleFullName, "js", function BSS$modules$_fetchModuleFileContent_onSuccess (moduleContent) {
						(new __win.Function(moduleContent)).call(__win);
					});
				}
			},
			_loadModule = function BSS$modules$_loadModule (moduleFullName, callback) {
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
			_loadModules = function BSS$modules$_loadModules (modulesFullNames, callback) {
				var modulesCount = modulesFullNames && modulesFullNames.length || 0,
					callbackArgs = [],
					getEachModuleCallback = function BSS$modules$_loadModules_getEachModuleCallback () {
						return callback && function BSS$modules$_loadModules_eachModuleCallback (module) {
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
			_registerModule = function BSS$modules$_registerModule (moduleFullName, module) {
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
			registerNamespace: function BSS$modules$registerNamespace (name, path) {
				_registeredNamespaces[name] = path;
			},
			define: function BSS$modules$define (moduleFullName, deps, moduleGetter) {
				if (!_definedModules[moduleFullName]) {
					_definedModules[moduleFullName] = true;
					_loadModules(deps, function BSS$modules$_loadModules_callback () {
						var moduleCtor = moduleGetter.apply(__win, arguments);
						_registerModule(moduleFullName, moduleCtor);
					});
				}
			},
			require: function BSS$modules$require (requiredCode, callback) {
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
], "mainScript");