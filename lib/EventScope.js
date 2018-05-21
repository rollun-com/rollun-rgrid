define([
    'dojo/_base/declare',
    'dojo/Evented',
    'dojo/on',
], function (declare,
             Evented) {
    return declare('EventScope', {}, {
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
            component.eventBus = (this._eventBus);
            this._registeredComponents.push(component);
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