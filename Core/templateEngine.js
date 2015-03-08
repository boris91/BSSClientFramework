BSS.modules.define("core.templateEngine", null, function BSS$core$modules$define_moduleGetter_templateEngine () {
	"use strict";

	var _Func = BSS.Func,
		_getTemplateEngine = function BSS$core$templateEngine$_getTemplateEngine (processedTemplateString) {
			return new _Func("dataModel", "targetContainerId",
				"var resultHtml = [],\n" +
				"	print = function BSS$core$templateEngine$_getTemplateEngine_print () {\n" +
				"		resultHtml.push.apply(resultHtml, arguments);\n" +
				"	},\n" +
				"	targetContainer;\n\n" +

				"resultHtml.push('" + processedTemplateString + "');\n\n" +

				"resultHtml = resultHtml.join('');\n\n" +

				"if (targetContainerId) {\n" +
				"	targetContainer = doc.getElementById(targetContainerId);\n" +
				"	if (targetContainer) {\n" +
				"		targetContainer.innerHTML = resultHtml;\n" +
				"	}\n" +
				"}\n\n" +

				"return resultHtml;");
		};

	return function BSS$core$templateEngine (templateString) {
		var processedTemplateString = templateString.replace(/[\r\t\n]/g, " ")
		.split("&lt;%").join("<%")
		.split("%&gt;").join("%>")
		.split("<%").join("\t")
		.replace(/((^|%>)[^\t]*)'/g, "dataModel.$1\\'")
		.replace(/\t=(.*?)%>/g, "',dataModel.$1,'")
		.split("\t").join("');")
		.split("%>").join("resultHtml.push('");

		return _getTemplateEngine(processedTemplateString);
	};
});