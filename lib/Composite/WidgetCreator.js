define([
	'dojo/_base/declare'
], function (declare) {
	return declare('WidgetCreator', null, {
		_eventScope: null,
		_configStore: null,

		setup: function (configStore, eventScope) {
			this._eventScope = eventScope;
			this._configStore = configStore;
		},

		createWidget: function (prefab, params) {
			const widget = prefab.deploy(this._configStore, params);
			this._eventScope.register(widget);
			if (!widget.attachPoint){
				if (params.attachPoint){
					widget.attachPoint = params.attachPoint;
				} else {
					throw new Error('Attach point is missing');
				}
			}
			return widget;
		}
	});
});