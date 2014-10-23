﻿BSS.modules.define(".ajax", null, function () {

	var _xhrs = {},
		_createXmlHttpRequest = function (params) {
			var xhr = new BSS.window.XMLHttpRequest(),
				xhrHeaders = params.headers || {},
				xhrQueryOptions = params.queryOptions || {},
				xhrQuery = "?",
				xhrIsAsync = (false !== params.async),
				headerName, queryOption;

			for (queryOption in xhrQueryOptions) {
				xhrQuery += queryOption + "=" + xhrQueryOptions[queryOption] + "&";
			}

			xhr.id = BSS.idsGenerator.getId();
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
		_syncReadyStateChangeHandler = function (xhr, params) {
			var xhrSucceeded = (200 === xhr.status),
				xhrResponse = {
					success: xhrSucceeded,
					value: xhrSucceeded ? BSS.window.JSON.parse(xhr.response || xhr.responseText) : (xhr.response || xhr.responseText)
				},
				callback = function () { return xhrResponse; };

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
		_getAsyncReadyStateChangeHandler = function (xhr, params) {
			return function () {
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
				url: BSS.routes.XXX,
				queryOptions: {
					fileName: "root/next/users.json",
					maxCount: 100,
					onlyRussian: true,
					nergo: false
				},
				data: {...},
				headers: {...},
				onSuccess: function (response) {...},
				onError: function (response) {...}
			}
		*/
		send: function (params) {
			var xhr = _createXmlHttpRequest(params);
			xhr.send(params.data || null);
			if (false === params.async) {
				return _syncReadyStateChangeHandler(xhr, params);
			}
		},
		abort: function (xhrId) {
			var xhr = _xhrs[xhrId];
			if (xhr) {
				xhr.abort();
				return true;
			}
			return false;
		},
		abortAll: function () {
			var xhrId;
			for (xhrId in _xhrs) {
				_xhrs[xhrId].abort();
			}
			_xhrs = {};
		}
	};
});