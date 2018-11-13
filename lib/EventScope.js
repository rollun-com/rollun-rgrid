define([
    'dojo/_base/declare',
    'dojo/Evented',
], function (declare, Evented) {
    return declare('EventScope', null, {// TODO: implement aspecting around eventBus
        _eventBus: null,
        _registeredComponents: [],

        constructor: function (params) {
            params = params || {};
            if (typeof params.eventBus === 'object') {
                this._eventBus = params.eventBus;
            } else {
                this._eventBus = new Evented();
            }
            if (Array.isArray(params.components)) {
                this.registerMultiple(params.components);
            }
        },

        /**
         * @param component {object} - any object that implements EventDriven interface
         */
        register: function (component) {
            if (typeof component.setEventBus === 'function') {
                component.setEventBus(this._eventBus);
                this._registeredComponents.push(component);
            } else {
                throw new TypeError('Component does not have _EventDriven mixin');
            }
        },

        /**
         * @param components {array} - array of objects to register
         */
        registerMultiple: function (components) {
            components.forEach((component) => {
                this.register(component);
            });
        },

        /**
         * @returns {array} - array of registered objects
         */
        getRegisteredComponents: function () {
            return Object.assign([], this._registeredComponents);
        },
    });
});
