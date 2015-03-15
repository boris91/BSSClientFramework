BSS.modules.define("core.templateEngine",
	[
		"core.dom"
	],
	function BSS$core$modules$define_moduleGetter_templateEngine (BSS$core$dom) {
		"use strict";

		var BSS$Func = BSS.Func,
			_getTemplateEngine = function BSS$core$templateEngine$_getTemplateEngine (processedTemplateString) {
				return new BSS$Func("dataModel", "targetContainer",
					"var resultHtml = [],\n" +
					"	print = function BSS$core$templateEngine$_getTemplateEngine_print () {\n" +
					"		resultHtml.push.apply(resultHtml, arguments);\n" +
					"	};\n\n" +

					"resultHtml.push('" + processedTemplateString + "');\n\n" +

					"resultHtml = resultHtml.join('');\n\n" +

					"if (targetContainer) {\n" +
					"	this.createFromOuterHtml(resultHtml, targetContainer);\n" +
					"}\n" +

					"return resultHtml;").bind(BSS$core$dom);
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