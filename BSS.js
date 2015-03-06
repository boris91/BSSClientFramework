/*uses config.json content and window object as incoming arguments*/
(function IIFE$BSS (__configParams /* globalApplicationName, jsFilesDirectoryPath, defaultModules */, __win) {
	"use strict";

	var __doc, __head, __obj, __bssName, __jsFilesDirectoryPath, __bss;

	if (__win.hasOwnProperty(__configParams.globalApplicationName)) {
		return;
	}

	__doc = __win.document;
	__head = __doc.head;
	__obj = __win.Object;
	__bssName = __configParams.globalApplicationName;
	__jsFilesDirectoryPath = __configParams.jsFilesDirectoryPath;
	__bss = __win[__bssName] = {
		"window": __win,
		"document": __doc,
		"head": __head,
		"modules": (function IIFE$BSS$modules () {
			var _getModuleFilePath = function BSS$modules$_getModuleFilePath (moduleFullName, fileExt) {
					return __jsFilesDirectoryPath + moduleFullName.replace(/\./g, "/") + "." + fileExt;
				},
				_getModuleByFullName = function BSS$modules$_getModuleByFullName (fullName) {
					var module = null;
					try {
						if (fullName) {
							module = __win.eval(__bssName + "." + fullName);
						}
					} catch (exc) {
						/*
							module does not exist - do nothing and then return NULL finally
						*/
					} finally {
						return module;
					}
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

					if (!_getModuleByFullName(moduleFullName)) {
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
								parentObj[ancestorName] = {};
							}
							parentObj = parentObj[ancestorName];
						}
					}

					parentObj[moduleName] = module;
				};

			return {
				define: function BSS$modules$define (moduleFullName, depsNames, module) {
					var deps;
					if (!_getModuleByFullName(moduleFullName)) {
						if ("function" === typeof module) {
							deps = _loadModules(depsNames);
							module = module.apply(__win, deps);
						}
						_registerModule(moduleFullName, module);
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
				},
				remove: function BSS$modules$remove (moduleFullName) {
					var modulePathChain = moduleFullName.split("."),
						namespace, moduleShortName;

					do {
						moduleShortName = modulePathChain.pop();
						namespace = _getModuleByFullName(modulePathChain.join("."));
						delete namespace[moduleShortName];
					} while (0 < modulePathChain.length && 0 === __obj.getOwnPropertyNames(namespace).length);
				}
			};
		}())
	};

	// +++ require default modules +++
	(function IIFE$_requireDefaultModules () {
		var defaultModules = __configParams.defaultModules,
			bssModules, namespace, nsModules, nsModulesCount, i;

		if (defaultModules) {
			bssModules = __bss.modules;
			for (namespace in defaultModules) {
				nsModules = defaultModules[namespace];
				nsModulesCount = nsModules.length;
				for (i = 0; i < nsModulesCount; i++) {
					bssModules.require(namespace + "." + nsModules[i]);
				}
			}
		}
	})();
	// --- require default modules ---

})(configParams, window);