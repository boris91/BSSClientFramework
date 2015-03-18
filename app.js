(function IIFE$app (__configFilePath, __win) {
	"use strict";
	/*
			1. Reads config.json (required client preferences):
				a) list of modules to include by default ("defaultModules"),
				b) common JS-files directory path ("jsFilesDirectoryPath"),
				c) global object name ("globalApplicationName").
			2. Passes all client configuration preferences to main JS-file and executes its content as IIFE.
	*/

	__win["app"] = (function IIFE$app () {
		var _initialized = false,
			_initInProgress = false,
			_configParams = null,
			_sendAsyncXhr = function app$_sendAsyncXhr (url, onSuccess, onError) {
				var xhr = new __win.XMLHttpRequest();
				xhr.open("GET", url, true);
				xhr.onreadystatechange = function app$_sendAsyncXhr$onreadystatechange () {
					if (4 === this.readyState) {
						if (200 === xhr.status) {
							onSuccess(xhr.responseText);
						} else {
							onError(xhr.responseText);
						}
					}
				};
				xhr.send(null);
			},
			_writeToDoc = function app$_writeToDoc (text) {
				__win.document.write(text);
			},
			_readConfigFile = function app$_readConfigFile (onSuccessHandler, onErrorHandler) {
				var readConfigFile_onSuccess = function app$_readConfigFile_sendAsyncXhr_onSuccess (xhrResponseText) {
						try {
							_configParams = __win.JSON.parse(xhrResponseText);
							onSuccessHandler();
						} catch (ex) {
							onErrorHandler();
							_writeToDoc(ex);
						}
					},
					readConfigFile_onError = function app$_readConfiFile_sendAsyncXhr_onError (xhrResponseText) {
						_writeToDoc(xhrResponseText);
					};
				_sendAsyncXhr(__configFilePath, readConfigFile_onSuccess, readConfigFile_onError);
			},
			_requireMainModule = function app$_requireMainModule (onSuccessHandler) {
				var requireMainModule_onSuccess = function app$_requireMainModule_sendAsyncXhr_onSuccess (xhrResponseText) {
						try {
							(new __win.Function("configParams", "onSuccessHandler", xhrResponseText)).call(__win, _configParams, onSuccessHandler);
						} catch (ex) {
							_writeToDoc(ex);
						}
					},
					requireMainModule_onError = function app$_requireMainModule_sendAsyncXhr_onError (xhrResponseText) {
						_writeToDoc(xhrResponseText);
					},
					mainModuleUrl = _configParams["globalApplicationName"] + ".js";

				_sendAsyncXhr(mainModuleUrl, requireMainModule_onSuccess, requireMainModule_onError);
			};

		return {
			init: function app$init (onSuccessHandler) {
				if (!_initInProgress && !_initialized) {
					_initInProgress = true;
					_readConfigFile(function app$_readConfigFile_onSuccess () {
						_requireMainModule(onSuccessHandler);
						_initialized = true;
						_initInProgress = false;
					}, function app$_readConfigFile_onError () {
						_initInProgress = false;
					});
				}
			}
		};
	})();

})("config.json", window);