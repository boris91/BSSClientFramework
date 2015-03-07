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
			_configParams = null,
			_sendSyncXhr = function app$_sendSyncXhr (url, onSuccess, onError) {
				var xhr = new __win.XMLHttpRequest();
				xhr.open("GET", url, false);
				xhr.send(null);
				return (200 === xhr.status ? onSuccess : onError)(xhr.responseText);
			},
			_writeToDoc = function app$_writeToDoc (text) {
				__win.document.write(text);
			},
			_readConfigFile = function app$_readConfigFile () {
				var readConfigFile_onSuccess = function app$_readConfigFile_sendSyncXhr_onSuccess (xhrResponseText) {
						try {
							_configParams = __win.JSON.parse(xhrResponseText);
							return true;
						} catch (ex) {
							_writeToDoc(ex);
							return false;
						}
					},
					readConfigFile_onError = function app$_readConfiFile_sendSyncXhr_onError (xhrResponseText) {
						_writeToDoc(xhrResponseText);
						return false;
					};
				return _sendSyncXhr(__configFilePath, readConfigFile_onSuccess, readConfigFile_onError);
			},
			_requireMainModule = function app$_requireMainModule (onSuccessHandler) {
				var requireMainModule_onSuccess = function app$_requireMainModule_sendSyncXhr_onSuccess (xhrResponseText) {
						try {
							(new __win.Function("configParams", "onSuccessHandler", xhrResponseText)).call(__win, _configParams, onSuccessHandler);
							return true;
						} catch (ex) {
							_writeToDoc(ex);
							return false;
						}
					},
					requireMainModule_onError = function app$_requireMainModule_sendSyncXhr_onError (xhrResponseText) {
						_writeToDoc(xhrResponseText);
						return false;
					},
					mainModuleUrl = _configParams["globalApplicationName"] + ".js";
				return _sendSyncXhr(mainModuleUrl, requireMainModule_onSuccess, requireMainModule_onError);
			};

		return {
			init: function app$init (onSuccessHandler) {
				if (!_initialized && _readConfigFile() && _requireMainModule(onSuccessHandler)) {
					_initialized = true;
					return true;
				} else {
					_initialized = false;
					__win.alert("Application initialization failed!");
					return false;
				}
			}
		};
	})();

})("config.json", window);