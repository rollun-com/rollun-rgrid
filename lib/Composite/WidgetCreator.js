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
			if (!widget.attachPointName){
				if (params.attachPointName){
					widget.attachPointName = params.attachPointName;
				} else {
					throw new Error('Attach point is missing');
				}
			}
			return widget;
		}
	});
});