define([
	'dojo/_base/declare',
	'dojo/on',
	'dojo/Evented'
], function (declare,
			 on,
			 Evented) {
	return declare('_EventDrivenMixin', null, {
		_eventBus: new Evented(),//TODO: don`t forget that this property is shared across all instances
		_eventHandles: {},
		_eventHandlers: {},

		setEventBus: function (eventBus) {
			if (typeof eventBus.on === 'function' && eventBus.emit === 'function') {
				this._eventBus = eventBus;
			} else {
				throw new TypeError('eventBus is not an event emitter');
			}
			this._subscribeToEventBus();
		},

		_subscribeToEventBus: function () {
			if (this._eventHandlers === {}) {
				return;
			}
			for (let eventName of this._eventHandlers) {
				if (this._eventHandlers.hasOwnProperty(eventName)) {
					const eventHandler = this._eventHandlers[eventName];
					this.removeEventHandler(eventName);
					this.handleEvent(eventName, eventHandler);
				}
			}
		},

		/**
		 * @param eventName {string}
		 * @param eventObject? {object}
		 */
		emit: function (eventName, eventObject) {
			eventObject = eventObject || {};
			this._eventBus.emit(eventName, eventObject);
		},

		/**
		 * @param eventName {string}
		 * @param handler {function}
		 */
		handleEvent: function (eventName, handler) {
			let handle;
			try {
				handle = on(this._eventBus, eventName, handler);
			} catch (exception) {
				throw new Error(`Could not add handler for '${eventName}': ${exception.message}`);
			}
			this._eventHandlers[eventName] = handler;
			this._eventHandles[eventName] = handle;
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
			on.once(this._eventBus, eventName, function (){
				self.removeEventHandler(eventName);
			});
			this.handleEvent(eventName, handler);
		},

		removeEventHandler: function (eventName) {
			this._eventHandles[eventName].remove();
			delete this._eventHandlers[eventName];
			delete this._eventHandles[eventName];
		},
	});
});