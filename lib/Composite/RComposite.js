define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'rgrid/EventScope',
], function (declare,
			 _WidgetBase,
			 EventScope) {
	return declare('RComposite', [_WidgetBase], {
		_configStore: null,
		_prefabs: null,
		_widgets: null,
		_started: false,
		_widgetPlacer: null,
		_widgetFactory: null,
		_eventScope: null,

		/**
		 * @param params {{
		 * 					configStore: object,
		 * 					eventScope: object,
		 * 					widgetPlacer: object,
		 * 					widgetFactory: object,
		 * 					eventScope?: object,
		 * 					templateString?: string
		 * 				 }}
		 */
		constructor: function (params) {
			if (typeof params.configStore === 'object') {
				this._configStore = params.configStore;
			} else {
				throw new TypeError('configStore isn`t set or isn`t an object');
			}
			if (typeof params.eventScope === 'object') {
				this._eventScope = params.eventScope;
			} else {
				this._eventScope = new EventScope();
			}
			if (typeof params.widgetFactory === 'object') {
				this._widgetFactory = params.widgetFactory;
				this._widgetFactory.setup(this._configStore, this._eventScope);
			} else {
				throw new TypeError('creator is missing or  isn`t an object');
			}
			if (typeof params.widgetPlacer === 'object') {
				this._widgetPlacer = params.widgetPlacer;
			} else {
				throw new TypeError('placer is missing or  isn`t an object');
			}
			if (typeof params.templateString === 'string') {
				this._widgetPlacer.setTemplateString(params.templateString);
			}
			this._widgets = [];
			this._prefabs = [];
		},

		/**
		 * @param prefabs {array}
		 */
		addComponents: function (prefabs) {
			for (const prefab of prefabs) {
				this.addComponent(prefab);
			}
		},

		/**
		 * @param prefab {object}
		 */
		addComponent: function (prefab) {
			if (this._started) {
				throw new Error('Can`t add new widgets to Rgrid after startup');
			}
			this._prefabs.push(prefab);
		},

		startup: function () {
			this._started = true;
			this._createWidgets();
			this._placeFinalDom();
			this._ready();
		},

		_createWidgets: function () {
			this._prefabs.forEach((prefab) => {
				const widget = this._createWidget(prefab);
				this._widgets.push(widget);
				this._placeWidget(widget);
			});
		},

		/**
		 * @returns {object}
		 * @private
		 */
		_createWidget: function (prefab) {
			return this._widgetFactory.create(prefab);
		},

		/**
		 * @param widget {object} - dojo widget
		 */
		_placeWidget: function (widget) {
			this._widgetPlacer.place(widget);
		},

		/**
		 * Place all widgets on real document
		 * @private
		 */
		_placeFinalDom: function () {
			const finalDom = this._widgetPlacer.getResultingDom();
			this.domNode.appendChild(finalDom);
		},

		/**
		 * Reconfigure and resize widgets
		 * @private
		 */
		_ready: function () {
			for (const widget of this._widgets) {
				if (widget.reconfigure){
					widget.reconfigure();
				}
				if (widget.resize){
					widget.resize();
				}
				widget.startup();
			}
		},

		/**
		 * @returns {array} - registered widgets
		 */
		getWidgetList: function () {
			return Object.assign([], this._widgets);
		}
	});
});