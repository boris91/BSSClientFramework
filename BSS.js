/*uses config.json content and window object as incoming arguments*/
(function IIFE$BSS (__configParams /* globalApplicationName, jsFilesDirectoryPath, defaultModules */, __win) {
	"use strict";

	var __doc, __head, __obj, __bss, __bssModules, __jsFilesDirectoryPath;

	if (__win.hasOwnProperty(__configParams.globalApplicationName)) {
		return;
	}

	__doc = __win.document;
	__head = __doc.head;
	__obj = __win.Object;
	__bss = {};
	__jsFilesDirectoryPath = __configParams.jsFilesDirectoryPath;
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
				return __jsFilesDirectoryPath + moduleFullNameWithNamespace.replace(/\./g, "/") + "." + fileExt;
			},
			_fetchModuleFileContent = function BSS$modules$_fetchModuleFileContent (moduleFullName, fileExt, onSuccess) {
				var xhr = new __win.XMLHttpRequest();
				xhr.open("GET", _getModuleFilePath(moduleFullName, fileExt), false);
				xhr.send(null);
				if (200 === xhr.status) {
					onSuccess(xhr.responseText);
				} else {
					__doc.write(xhr.responseText);
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
							__obj.defineProperty(parentObj, ancestorName, {
								writable: false,
								value: {}
							});
						}
						parentObj = parentObj[ancestorName];
					}
				}

				__obj.defineProperty(parentObj, moduleName, {
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

	__obj.defineProperties(__bss, {
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

	__obj.defineProperty(__win, __configParams.globalApplicationName, {
		writable: false,
		value: __bss
	});

	// +++ require default modules +++
	(function IIFE$_requireDefaultModules () {
		var defaultModules = __configParams.defaultModules,
			namespace, splittedNs;

		for (namespace in defaultModules) {
			splittedNs = namespace.split(":");
			__bssModules.registerNamespace(splittedNs[0], splittedNs[1]);
			__bssModules.require(defaultModules[namespace]);
		}
	})();
	// --- require default modules ---

})(configParams, window);