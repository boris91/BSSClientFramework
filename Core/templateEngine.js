BSS.modules.define("core.templateEngine", null, function BSS$core$modules$define_moduleGetter_templateEngine () {
	"use strict";

	var _getTemplateEngine = function BSS$core$templateEngine$_getTemplateEngine (processedTemplateString) {
		return new BSS.window.Function("objectToShow", "targetContainerId",
			"var resultHtml = [],\n" +
			"	print = function BSS$core$templateEngine$_getTemplateEngine_print () {\n" +
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

	return function BSS$core$templateEngine (templateString) {
		var processedTemplateString = templateString.replace(/[\r\t\n]/g, " ");
		processedTemplateString = processedTemplateString.split("&lt;%").join("<%");
		processedTemplateString = processedTemplateString.split("%&gt;").join("%>");
		processedTemplateString = processedTemplateString.split("<%").join("\t");
		processedTemplateString = processedTemplateString.replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'");
		processedTemplateString = processedTemplateString.split("\t").join("');");
		processedTemplateString = processedTemplateString.split("%>").join("resultHtml.push('");
		processedTemplateString = processedTemplateString.split("\r").join("\\'");
		return _getTemplateEngine(processedTemplateString);
	};
});