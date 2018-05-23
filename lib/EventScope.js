'use strict';
define([
	'dojo/_base/declare',
	'dojo/Evented',
], function (declare,
			 Evented) {
	return declare('EventScope', null, {//TODO: implement aspecting around eventBus
		_eventBus: null,
		_registeredComponents: [],

		constructor: function (params) {
			if (typeof params.eventBus === 'object') {
				this._eventBus = params.eventBus;
			} else {
				this._eventBus = new Evented();
			}
			if (Array.isArray(params.components)) {
				this.registerComponents(params.components);
			}
		},

		registerComponent: function (component) {
			if (typeof component.setEventBus === 'function') {
				component.setEventBus(this._eventBus);
				this._registeredComponents.push(component);
			}
			else {
				throw new TypeError('Component doew not have _EventDrivenMixin');
			}
		},
		registerComponents: function (components) {
			for (let component of components) {
				this.registerComponent(component);
			}
		},
		getRegisteredComponents: function () {
			return Object.assign([], this._registeredComponents);
		}
	});
});