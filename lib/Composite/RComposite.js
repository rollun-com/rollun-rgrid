define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
], function (declare,
			 _WidgetBase) {
	return declare('RComposite', [_WidgetBase], {
		_configStore: null,
		_prefabs: [],
		_widgets: [],
		_started: false,
		_templateName: null,
		_placer: null,
		_creator: null,

		constructor: function (params) {
			if (typeof params.configStore === 'object') {
				this._configStore = params.configStore;
			} else {
				throw new TypeError('configStore isn`t set or isn`t an object');
			}
			if (typeof params.creator === 'object') {
				this._creator = params.creator;
				this._creator.setup(this._configStore, this._eventScope);
			} else {
				throw new TypeError('creator is missing or  isn`t an object');
			}
			if (typeof params.placer === 'object') {
				this._placer = params.placer;
			} else {
				throw new TypeError('placer is missing or  isn`t an object');
			}
			if (typeof params.templateString === 'string') {
				this._placer.setTemplateString(params.templateString);
			}
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
			this._widgets.forEach((prefab) => {
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
			return this._creator.create(prefab);
		},

		/**
		 * @param widget {object} - dojo widget
		 */
		_placeWidget: function (widget) {
			this._placer.placeWidget(widget);
		},

		_placeFinalDom: function () {
			const finalDom = this._placer.getResultingDom();
			this.domNode.appendChild(finalDom);
		},

		_ready: function () {
			for (const widget in this._widgets) {
				if (widget.reconfigure()){
					widget.reconfigure();
				}
				if (widget.resize()){
					widget.resize();
				}
			}
		},

		getWidgetList: function () {
			return Object.assign([], this._widgets);
		}
	});
});