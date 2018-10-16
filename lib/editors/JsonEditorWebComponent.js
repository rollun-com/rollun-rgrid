define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dojo/dom-construct',
	'dojo/on',
	'https://cdn.jsdelivr.net/npm/jsoneditor@5.24.6/dist/jsoneditor.min.js',
	'dojo/dom-class',
	'dojo/_base/lang',
], function (declare, _WidgetBase, domConstruct, on, JsonEditor, domClass, lang, Grid) {
	return declare([_WidgetBase], {
		value: null,
		constructor: function (params) {
			params = params || {};
			this._options = params.options || {};
		},
		buildRendering: function () {
			if (!this.domNode) {
				this.domNode = domConstruct.toDom('<div class="json-editor-widget border" tabindex="-1"></div>');
			}
			this._editor = new JsonEditor(this.domNode, this._options);
		},

		_setValueAttr: function (value) {
			this._editor.set(JSON.parse(value));
			this.value = value;
		},

		_getValueAttr: function () {
			return this._editor.get();
		},

		destroy: function () {
			this._editor.destroy();
			this.inherited(arguments);
		}
	});
});