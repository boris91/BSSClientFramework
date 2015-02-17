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
			_getModuleFilePath = function BSS$modules$_getModuleFilePath (moduleFullName, fileExt) {
				return __jsFilesDirectoryPath + moduleFullName.replace(/\./g, "/") + "." + fileExt;
			},
			_getModuleByFullName = function BSS$modules$_getModuleByFullName (fullName) {
				var modulePathChain, modulePathChainLength, objToReturn, i;
					objToReturn = __bss;
					modulePathChain = fullName.split(".");
					modulePathChainLength = modulePathChain.length;
					for (i = 0; i < modulePathChainLength; i++) {
						objToReturn = objToReturn[modulePathChain[i]];
					}
					return objToReturn;
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
						_registerModule(templateFullName, __bss.core.templateEngine(templateString));
					});
				},
				js: function BSS$modules$_loaders$js (moduleFullName) {
					_fetchModuleFileContent(moduleFullName, "js", function BSS$modules$_fetchModuleFileContent_onSuccess (moduleContent) {
						(new __win.Function(moduleContent)).call(__win);
					});
				}
			},
			_loadModule = function BSS$modules$_loadModule (moduleFullName) {
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
					loader(moduleFullName);
				}

				return _getModuleByFullName(moduleFullName);
			},
			_loadModules = function BSS$modules$_loadModules (modulesFullNames) {
				var modulesCount = modulesFullNames && modulesFullNames.length || 0,
					loadedModules = [],
					moduleFullName, module, i;

				for (i = 0; i < modulesCount; i++) {
					moduleFullName = modulesFullNames[i];
					module = _loadModule(moduleFullName);
					loadedModules.push(module);
				}

				return loadedModules;
			},
			_registerModule = function BSS$modules$_registerModule (moduleFullName, module) {
				var modulePathChain = moduleFullName.split("."),
					ancestorsCount = modulePathChain.length - 1,
					moduleName = modulePathChain[ancestorsCount],
					parentObj = __bss,
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
			};

		return {
			define: function BSS$modules$define (moduleFullName, depsNames, moduleGetter) {
				var deps, moduleCtor;
				if (!_definedModules[moduleFullName]) {
					_definedModules[moduleFullName] = true;
					deps = _loadModules(depsNames);
					moduleCtor = moduleGetter.apply(__win, deps);
					_registerModule(moduleFullName, moduleCtor);
				}
			},
			require: function BSS$modules$require (requiredCode, callback) {
				var callbackArgs;

				if ("string" === typeof requiredCode) {
					callbackArgs = [_loadModule(requiredCode)];
				} else {
					callbackArgs = _loadModules(requiredCode);
				}

				if ("function" === typeof callback) {
					callback.apply(__win, callbackArgs);
				}
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
			namespace, nsModules, nsModulesCount, i;

		for (namespace in defaultModules) {
			nsModules = defaultModules[namespace];
			nsModulesCount = nsModules.length;
			for (i = 0; i < nsModulesCount; i++) {
				__bssModules.require(namespace + "." + nsModules[i]);
			}
		}
	})();
	// --- require default modules ---

})(configParams, window);