define(['dojo/_base/declare',
		'dijit/_WidgetBase'],
	function (declare,
	 _WidgetBase) {
		return declare('HideableTabsContainer', [_WidgetBase], {
			_started: null,
			_panes: null,
			constructor: function (params = {}) {
				this.inherited(arguments);
				this._started = false;
				if (Array.isPrototypeOf(params.panes)) {
					this.addPanes(params.panes);
				} else {
					this._panes = []
				}
			},

			buildRendering: function () {
				this.inherited(arguments);
				for (const pane of this._panes) {
					pane.placeAt(this.domNode);
					this._addHandlers(pane);
				}
			},

			startup: function () {
				this._started = true;
				this.inherited(arguments);
				for (const pane of this._panes) {
					pane.startup()
				}
			},

			_addHandlers: function (pane) {
				pane.on('click', () => {
					this._toggleAllNeighbours(pane.domNode)
				})
			},

			_toggleAllNeighbours: function (domNode) {
				let parentNode = this.domNode,
					neededNodeId = domNode.id;
				if (domNode.activated) {
					domNode.activated = false;
					for (const node of parentNode.children) {
						domStyle.set(node, 'display', 'block')

					}
				} else {
					domNode.activated = true;
					for (const node of parentNode.children) {
						if (node.id !== neededNodeId) {
							domStyle.set(node, 'display', 'none')
						}
					}
				}
			},

			/**
			 * @param pane {object}
			 */
			addPane: function (pane) {
				if (this._started){
					throw new Error('Can`t add new panes after start')
				}
				pane.open = false;
				this._panes.push(pane);
			},

			/**
			 * @param panes {array}
			 */
			addPanes: function (panes) {
				for (const pane of panes) {
					this.addPane(pane);
				}
			},

			isStarted: function () {
				return this._started
			},
		})
	});