define([
	'dojo/_base/declare',
	'dojo/on',
	'dojo/Evented'
], function (declare,
			 on,
			 Evented) {
	return declare('_EventDrivenMixin', null, {
		_eventBus: new Evented(),//don`t forget that this property is shared across all instances
		_eventHandles: null,
		_eventHandlers: null,

		constructor: function (params) {
			params = params ||{};
			this._eventHandles = {};
			this._eventHandlers = {};
			if (typeof params.eventBus === 'object'){
				this.setEventBus(params.eventBus);
			}
		},

		/**
		 * @param eventBus {{on: function, emit: function}}
		 */
		setEventBus: function (eventBus) {
			if (typeof eventBus.on === 'function' && typeof eventBus.emit === 'function') {
				this._eventBus = eventBus;
			} else {
				throw new TypeError('eventBus is not an event emitter');
			}
			this._subscribeToEventBus();
			this.reconfigure();
		},

		/**
		 * Attach all event handlers on event bus
		 */
		_subscribeToEventBus: function () {
			if (this._eventHandlers === {}) {
				return;
			}
			for (const eventName in this._eventHandlers) {
				if (this._eventHandlers.hasOwnProperty(eventName)) {
					const eventHandler = this._eventHandlers[eventName];
					this.removeEventHandler(eventName);
					this.handleEvent(eventName, eventHandler);
				}
			}
		},

		/**
		 * Reconfigure widget using data from new eventBus
		 */
		reconfigure: function () {

		},

		/**
		 * @param eventType {string}
		 * @param eventObject? {object}
		 */
		emit: function (eventType, eventObject) {
			eventObject = eventObject || {};
			eventObject.bubbles = false;
			this._eventBus.emit(eventType, eventObject);
		},

		/**
		 * @param eventType {string}
		 * @param handler {function}
		 */
		handleEvent: function (eventType, handler) {
			let handle;
			try {
				handle = on(this._eventBus, eventType, handler);
			} catch (exception) {
				throw new Error(`Could not add handler for '${eventType}': ${exception.message}`);
			}
			this._eventHandlers[eventType] = handler;
			this._eventHandles[eventType] = handle;
		},

		/**
		 * @param handlersConfig {{eventName: string, handler: function}[]}
		 */
		handleEvents: function (handlersConfig) {
			for (let config of handlersConfig) {
				this.handleEvent(config.eventName, config.handler);
			}
		},

		/**
		 * @param eventName {string}
		 * @param handler {function}
		 */
		handleEventOnce: function (eventName, handler) {
			const self = this;
			this.handleEvent(eventName, handler);
			on.once(this._eventBus, eventName, function (){
				self.removeEventHandler(eventName);
			});
		},

		removeEventHandler: function (eventName) {
			this._eventHandles[eventName].remove();
			delete this._eventHandlers[eventName];
			delete this._eventHandles[eventName];
		},
	});
});