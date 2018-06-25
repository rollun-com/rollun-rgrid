define([
	'dojo/_base/declare',
	'rgrid/mixins/_EventDriven',
	'dijit/_WidgetBase',
	'dojo/dom-class'
], function (declare,
			 _EventDriven,
			 _WidgetBase,
			 domClass
			 ) {
	return declare('WebhookButtonGroup', [_WidgetBase, _EventDriven], {
		class: 'rgrid-webhook-btn-group',
		_buttons: null,

		constructor: function (params) {
			this._buttons = new Map();
			if (Array.isArray(params.buttons)) {
				for (const button of params.buttons) {
					this._buttons.set(Math.random(), button);
				}
			}
		},

		buildRendering: function () {
			for (const [key, button] of this._buttons) {
				button.placeAt(this.domNode);
				domClass.add(button.domNode, 'rgrid-webhook-btn');
			}
		},

		setEventBus: function (eventBus) {
			this.inherited(arguments);
			for (const [key, button] of this._buttons) {
				if (button.setEventBus) {
					button.setEventBus(eventBus);
				}
			}
		},

		reconfigure: function () {
		this.inherited(arguments);
			for (const [key, button] of this._buttons) {
				if (button.reconfigure) {
					button.reconfigure();
				}
			}
		}
	});
});