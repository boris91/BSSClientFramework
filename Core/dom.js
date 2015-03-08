BSS.modules.define("core.dom", null, function () {
	"use strict";

	var _win = BSS.win,
		_doc = _win.document,
		_docHead = _doc.head,
		_docBody = _doc.body,
		_bssCoreDom;

	if ("complete" !== _doc.readyState) {
		_win.addEventListener("load", function BSS$win$onload$listener () {
			_docHead = _docHead || (_bssCoreDom.head = _doc.head);
			_docBody = _docBody || (_bssCoreDom.body = _doc.body);
			_win.removeEventListener("load", BSS$win$onload$listener);
		});
	}

	_bssCoreDom = {
		doc: _doc,
		head: _docHead,
		body: _docBody,

		getAll: function BSS$core$dom$getAll (selector, targetNode) {
			return (targetNode || _doc).querySelectorAll(selector);
		},
		getFirst: function BSS$core$dom$getFirst (selector, targetNode) {
			return (targetNode || _doc).querySelector(selector);
		},

		create: function BSS$core$dom$create (tagName, properties, children, parentNode) {
			var node = _doc.createElement(tagName),
				propName, i, childrenCount, childData;

			if (undefined !== properties) {
				for (propName in properties) {
					node[propName] = properties[propName];
				}
			}

			if (undefined !== children) {
				childrenCount = children.length;
				for (i = 0; i < childrenCount; i++) {
					childData = children[i];
					this.create(childData.tagName, childData.properties, childData.children, node);
				}
			}

			if (undefined !== parentNode) {
				parentNode.appendChild(node);
			}

			return node;
		},
		createFragment: function BSS$core$dom$createFragment (nodesData /* Array of objects: { tagName, properties, children } */, parentNode) {
			var docFragment = _doc.createDocumentFragment(),
				nodesCount = nodesData.length,
				i, nodeData;

			for (i = 0; i < nodesCount; i++) {
				nodeData = nodesData[i];
				this.create(nodeData.tagName, nodeData.properties, nodeData.children, docFragment);
			}

			if (parentNode) {
				parentNode.appendChild(docFragment);
			}

			return docFragment;
		}
	};

	return _bssCoreDom;
});