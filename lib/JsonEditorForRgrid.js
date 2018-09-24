define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dojo/dom-construct',
	'https://cdn.jsdelivr.net/npm/jsoneditor@5.24.6/dist/jsoneditor.min.js',
], function (declare, _WidgetBase, domConstruct, JsonEditor) {
	return declare([_WidgetBase], {
		constructor: function (params) {
			this._options = {};
		},
		buildRendering: function () {
			if (!this.domNode) {
				this.domNode = domConstruct.create('div');
			}
			this._editor = new JsonEditor(this.domNode, this._options);
			const json = {
				"Array": [1, 2, 3],
				"Boolean": true,
				"Null": null,
				"Number": 123,
				"Object": {
					"a": "b",
					"c": "d"
				},
				"String": "Hello World"
			};
			this._editor.set(json);
		},

	})
});