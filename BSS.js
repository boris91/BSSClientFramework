/*uses config.json content and success handler function as incoming arguments*/
(function IIFE$BSS (__configParams /* globalApplicationName, jsFilesDirectoryPath, startOnDocReady, defaultModules */, __onSuccessHandler) {
	"use strict";

	var __win = this,
		__doc = __win.document,
		__bssName = __configParams["globalApplicationName"],
		__obj, __xhr, __jsFilesDirectoryPath, __bss;

	if (__win.hasOwnProperty(__bssName)) {
		return;
	} else if (__configParams["startOnDocReady"] && "complete" !== __doc.readyState) {
		__win.addEventListener("load", function BSS$__win$onload$listener () {
			IIFE$BSS.call(__win, __configParams, __onSuccessHandler);
			__win.removeEventListener("load", BSS$__win$onload$listener);
		}, false);
		return;
	}

	__jsFilesDirectoryPath = __configParams["jsFilesDirectoryPath"];
	__bss = __win[__bssName] = {

		"win": __win,

		"Obj": (__obj = __win.Object),
		"ObjProto": __obj.prototype,
		"Arr": __win.Array,
		"ArrProto": __win.Array.prototype,
		"Func": __win.Function,
		"FuncProto": __win.Function.prototype,
		"Str": __win.String,
		"StrProto": __win.String.prototype,
		"Num": __win.Number,
		"NumProto": __win.Number.prototype,
		"Bool": __win.Boolean,
		"BoolProto": __win.Boolean.prototype,
		"Time": __win.Date,
		"TimeProto": __win.Date.prototype,

		"Arrbuf": __win.ArrayBuffer,
		"Dataview": __win.DataView,
		"Json": __win.JSON,
		"Domparser": __win.DomParser,
		"Docfragment": __win.DocumentFragment,
		"Maths": __win.Math,
		"Reg": __win.RegExp,
		"Evt": __win.Event,
		"Xhr": (__xhr = __win.XMLHttpRequest),

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
					var xhr = new __xhr();
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
							__win.eval(moduleContent);
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
		var defaultModules = __configParams["defaultModules"],
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

	if ("function" === typeof __onSuccessHandler) {
		__onSuccessHandler();
	}

}).call(this, configParams, onSuccessHandler);