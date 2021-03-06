﻿BSS.modules.define("core.ajax",
	[
		"core.idsGenerator"
	],
	function BSS$modules$define_moduleGetter_ajax (BSS$core$idsGenerator) {
		"use strict";

		var BSS$Xhr = BSS.Xhr,
			_Json = BSS.Json,
			_xhrs = {},
			_createXmlHttpRequest = function BSS$core$ajax$_createXmlHttpRequest (params) {
				var xhr = new BSS$Xhr(),
					xhrHeaders = params.headers || {},
					xhrQueryOptions = params.queryOptions || {},
					xhrQuery = "?",
					xhrIsAsync = (false !== params.async),
					headerName, queryOption;

				for (queryOption in xhrQueryOptions) {
					xhrQuery += queryOption + "=" + xhrQueryOptions[queryOption] + "&";
				}

				xhr.id = BSS$core$idsGenerator.getId();
				_xhrs[xhr.id] = xhr;

				xhr.open(params.method, params.url + xhrQuery, xhrIsAsync);

				if (xhrIsAsync) {
					xhr.onreadystatechange = _getAsyncReadyStateChangeHandler(xhr, params);
				}

				for (headerName in xhrHeaders) {
					xhr.setRequestHeader(headerName, xhrHeaders[headerName]);
				}

				return xhr;
			},
			_syncReadyStateChangeHandler = function BSS$core$ajax$_syncReadyStateChangeHandler (xhr, params) {
				var xhrSucceeded = (200 === xhr.status),
					parseResultAsJson = xhrSucceeded && (false !== params.handleAsJson),
					xhrResponse = {
						success: xhrSucceeded,
						value: parseResultAsJson ? _Json.parse(xhr.response || xhr.responseText) : (xhr.response || xhr.responseText)
					},
					callback = function BSS$core$ajax$_syncReadyStateChangeHandler_callback () { return xhrResponse; };

				if (false !== params.async) {
					if (xhrSucceeded) {
						callback = params.onSuccess || callback;
					} else {
						callback = params.onError || callback;
					}
				}

				delete _xhrs[xhr.id];

				return callback(xhrResponse.value);
			},
			_getAsyncReadyStateChangeHandler = function BSS$core$ajax$_getAsyncReadyStateChangeHandler (xhr, params) {
				return function BSS$core$ajax$_getAsyncReadyStateChangeHandler_asyncReadyStateChangeHandler () {
					if (4 === xhr.readyState) {
						return _syncReadyStateChangeHandler(xhr, params);
					}
				};
			};

		return {
			/*
				params: {
					method: "OPTIONS"/"GET"/"HEAD"/"POST"/"PUT"/"PATCH"/"DELETE"/"TRACE"/"CONNECT",
					async: true/false,
					url: routes.XXX,
					queryOptions: {
						fileName: "root/next/users.json",
						maxCount: 100,
						onlyRussian: true,
						nergo: false
					},
					data: {...},
					headers: {...},
					onSuccess: function (response) {...},
					onError: function (response) {...},
					handleAsJson: true/false
				}
			*/
			send: function BSS$core$ajax$send (params) {
				var xhr = _createXmlHttpRequest(params);
				xhr.send(params.data || null);
				if (false === params.async) {
					return _syncReadyStateChangeHandler(xhr, params);
				}
			},
			abort: function BSS$core$ajax$abort (xhrId) {
				var xhr = _xhrs[xhrId];
				if (xhr) {
					xhr.abort();
					return true;
				}
				return false;
			},
			abortAll: function BSS$core$ajax$abortAll () {
				var xhrId;
				for (xhrId in _xhrs) {
					_xhrs[xhrId].abort();
				}
				_xhrs = {};
			}
		};
});