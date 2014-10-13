BSS.modules.define("templateEngine", null, function () {
	var _getTemplateEngine = function (processedTemplateString) {
		return new BSS.window.Function("objectToShow", "targetContainerId",
			"var resultHtml = [],\n" +
			"	print = function () {\n" +
			"		resultHtml.push.apply(resultHtml,arguments);\n" +
			"	},\n" +
			"	targetContainer;\n\n" +

			"with (objectToShow) {\n" +
			"	resultHtml.push('" + processedTemplateString + "');\n" +
			"}\n\n" +

			"resultHtml = resultHtml.join('');\n\n" +

			"if (targetContainerId) {\n" +
			"	targetContainer = BSS.document.getElementById(targetContainerId);\n" +
			"	if (targetContainer) {\n" +
			"		targetContainer.innerHTML = resultHtml;\n" +
			"	}\n" +
			"}\n\n" +

			"return resultHtml;");
		};

	return function (templateString) {
		var processedTemplateString = templateString.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'").replace(/\"/g, "\\\"");
		return _getTemplateEngine(processedTemplateString);
	};
});