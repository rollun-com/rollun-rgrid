define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin'
], function (declare,
			 _WidgetBase,
			 _TemplatedMixin) {
	return declare('TemplateWidgetPlacer', [_TemplatedMixin], {
		templateString: null,

		setTemplateString: function (templateString) {
			this.templateString = templateString;
			this.buildRendering();
		},

		place: function (widget) {
			const attachPointNode = this[widget.attachPoint];
			if (attachPointNode) {
				attachPointNode.appendChild(widget.domNode);
			} else {
				throw new Error(`Couldn\`t find attach point "${widget.attachPoint}" in template`);
			}
		},

		getResultingDom: function () {
			return this.domNode;
		}
	});
});