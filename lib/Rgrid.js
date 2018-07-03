define([
	'dojo/_base/declare',
	'dgrid/Grid',
	'rql/query',
	'dgrid/extensions/ColumnHider',
	'dgrid/extensions/ColumnResizer',
	'dgrid/extensions/ColumnReorder',
	'dgrid/Selection',
	'dojo/dom-construct',
	'rgrid/mixins/_EventDriven',
	'dojo/on',
	'dijit/Dialog',
	'dojo/dom-style',
	'rgrid/RqlBuilder'
], function (declare,
			 Grid,
			 Query,
			 ColumnHider,
			 ColumnResizer,
			 ColumnReorder,
			 Selection,
			 domConstruct,
			 _EventDriven,
			 on,
			 Dialog,
			 domStyle,
			 RqlBuilder) {
	return declare('Rgrid', [
		Grid,
		ColumnHider,
		ColumnResizer,
		ColumnReorder,
		Selection,
		_EventDriven
	], {
		collection: null,
		_query: null,
		_totalCount: null,
		_errorDialog: null,
		allowTextSelection: true,
		_loadingMessage: '<i class="fa fa-cog fa-spin fa-fw fa-6" style="font-size: 6em;position: relative;margin: 10%;left: 35%;"></i>',
		_columnsConfig: null,
		_rqlBuilder: null,

		/**
		 * @param params {{collection: object, query?: object, filterBarNode?: object}} -
		 *          collection - QueryableStore that will provide data for a grid
		 *          query - rollun-rql Query object,
		 *          filterBarNode - DOM node that will contain filter display buttons
		 */
		constructor: function (params) {
			this._rqlBuilder = new RqlBuilder();
			if (typeof params.collection === 'object') {
				this.collection = params.collection;
			} else {
				throw new TypeError('Store passed to constructor is missing or is not an object');
			}
			if (typeof params.eventBus === 'object') {
				this.setEventBus(params.eventBus);
			}
			if (typeof params.query === 'object') {
				this.setQuery(params.query);
			} else {
				this._query = new Query.Query({
					name: "limit",
					args: [20]
				});
			}
			if (typeof params.filterBlockNode === 'object') {
				this._filterBlockNode = params.filterBlockNode;
			}
			if (typeof params.columnsConfig === 'object') {
				this._columnsConfig = params.columnsConfig;
			}
			this._rqlBuilder.addToCache('default', this.getQuery());
		},

		buildRendering: function () {
			this.inherited(arguments);
			if (!this._filterBlockNode) {
				this._filterBlockNode = domConstruct.create('div', null, this.headerNode, 'before');
			}
			domStyle.set(this.domNode, 'min-height', '30em');
		},

		postCreate: function () {
			this.inherited(arguments);
			this._handleColumnChanges();
			this._handleStoreErrors();
			this._startEmittingColumnSelect();
		},

		_handleColumnChanges: function () {
			on(this.domNode, 'dgrid-sort', (event) => {
				let sortArg;
				if (event.sort[0].descending) {
					sortArg = '-' + event.sort[0].property;
				} else {
					sortArg = '+' + event.sort[0].property;
				}
				const sortNode = new Query.Query({
					name: 'sort',
					args: [sortArg]
				});
				this.appendQuery(sortNode);
				this._rqlBuilder.addToCache('sort', sortNode);
			});
			on(this.domNode, 'dgrid-columnreorder', (event) => {
				let args = [];
				for (const object of event.subRow) {
					args.push(object.field);
				}
				const selectNode = new Query.Query({
					name: 'select',
					args: args
				});
				this.appendQuery(selectNode);
				this._rqlBuilder.addToCache('select', selectNode);
			});
			on(this.domNode, 'dgrid-columnstatechange', () => {
				let args = [];
				for (const columnIndex in this.columns) {
					if (!this.columns[columnIndex].hidden) {
						args.push(this.columns[columnIndex].field);
					}
				}
				const selectNode = new Query.Query({
					name: 'select',
					args: args
				});
				this.appendQuery(selectNode);
				this._rqlBuilder.addToCache('select', selectNode);
				this._toggleColumnHiderMenu();
				this._toggleColumnHiderMenu();
			});
		},

		_handleStoreErrors: function () {
			on(this.collection, 'failedQuery', (event) => {
				const errorMessage = `<div class="alert alert-danger">Запрос к серверу не удался. Причина:\n ${event.message}</div>`;
				if (!this._errorDialog) {
					this._createErrorDialog();
				}
				if (this._loadingMessage) {
					this._cleanupLoading();
				}
				this._errorDialog.set('content', errorMessage);
				this._errorDialog.show();
				console.log(event.response);
			});
			on(this.collection, 'missingTotalCount', () => {
				const errorMessage = '<div class="alert alert-warning">Отсутствует количество результатов по запросу. Некоторые модули (например пагинация) будут работать с ошибками</div>';
				if (!this._errorDialog) {
					this._createErrorDialog();
				}
				this._errorDialog.set('content', errorMessage);
				this._errorDialog.show();
			});
		},

		_createErrorDialog: function () {
			this._errorDialog = new Dialog({
				title: 'Возникла ошибка',
				content: '',
				style: 'width: 600px; height: auto;'
			});
		},

		_startEmittingColumnSelect: function () {
			on(this.contentNode, 'dgrid-select', (event) => {
				this.emit('gridSelect', event);
			});
			on(this.contentNode, 'dgrid-deselect', (event) => {
				this.emit('gridDeselect', event);
			});
		},

		/**
		 * @param label {string} - text that will be displayed on the filter block
		 * @param nodeKey {number}
		 */
		setFilterBlock: function (label, nodeKey) {
			label = label || 'Фильтр';
			const filterNode = this._getFilterNode(label, nodeKey);
			this._filterBlockNode.appendChild(filterNode);
		},

		_getFilterNode: function (label, nodeKey) {
			const filterNode = domConstruct.create('button', {'class': "btn btn-warning filter_active"});
			on(filterNode, "click", () => {
					this._rqlBuilder.removeFromCache(nodeKey);
					domConstruct.destroy(filterNode);
					this.emit("filterRemovedFromGrid");
					this._buildQueryFromCache();
					this.loadContent();
				}
			);
			domConstruct.place("<div class='glyphicon glyphicon-remove' style='float:right;'></div><p>" + 'Убрать ' + label + "</p>", filterNode);
			return filterNode;
		},

		_buildQueryFromCache: function () {
			this._rqlBuilder.buildQueryFromCache();
		},

		loadContent: function () {
			const response = this.collection.query(this._rqlBuilder.getQuery());
			if (this._loadingMessage) {
				this._cleanupContent();
				this.loadingNode = domConstruct.create('div', {
					className: 'dgrid-loading',
					innerHTML: this._loadingMessage
				}, this.contentNode);
			}
			return response.then((response) => {
				this._cleanupLoading();
				this._renderResponseData(response);
				this.emit('gridLoadedContent', {
					columns: Object.assign({}, this.columns),
					totalCount: this._totalCount
				});
			}, function (error) {
				throw new Error(error.message);
			});
		},

		_cleanupLoading: function () {
			if (this.loadingNode) {
				domConstruct.destroy(this.loadingNode);
				delete this.loadingNode;
			}
			else if (this._oldPageNodes) {
				for (const id of this._oldPageNodes) {
					this.removeRow(this._oldPageNodes[id]);
				}
				delete this._oldPageNodes;
			}
			delete this._isLoading;
		},

		/**
		 * @param response {array} - response from store
		 * @private
		 */
		_renderResponseData: function (response) {
			response = response || [];
			if (response.length > 0) {
				const columns = this._getColumnsFromResponse(response);
				this.set('columns', columns);
			}
			this.renderArray(response);
			this.resize();
			this._totalCount = this.collection.totalCount;
		},

		/**
		 * @param response {array}
		 * @returns {array} - dgrid column definition objects
		 * @private
		 */
		_getColumnsFromResponse: function (response) {
			const finalColumns = [],
				newColumnsNames = Object.keys(response[0]);
			if (this.columns && Object.keys(this.columns).length > 0) {//columns are present
				for (const columnId in this.columns) {
					if (this.columns.hasOwnProperty(columnId)) {
						let column = Object.assign({}, this.columns[columnId]);
						column.hidden = (!newColumnsNames.find(item => item === column.field)) || false;
						if (this._columnsConfig) {
							column = this._addColumnConfig(column);
						}
						finalColumns.push(column);
					}
				}
			} else {
				for (const fieldName in response[0]) { //no columns were specified
					if (response[0].hasOwnProperty(fieldName)) {
						let column = {
							label: fieldName,
							field: fieldName,
							hidden: false
						};
						if (this._columnsConfig) {
							column = this._addColumnConfig(column);
						}
						finalColumns.push(column);
					}
				}
			}
			return finalColumns;
		},

		_addColumnConfig: function (column) {
			if (this._columnsConfig[column.field]) {
				if ('formatter' in this._columnsConfig[column.field]) {
					column.formatter = this._columnsConfig[column.field].formatter;
				}
				if ('renderCell' in this._columnsConfig[column.field]) {
					column.renderCell = this._columnsConfig[column.field].renderCell;
				}
				if ('width' in this._columnsConfig[column.field]) {
					column.width = this._columnsConfig[column.field].width;
				}
				if ('hidden' in this._columnsConfig[column.field]) {
					column.hidden = this._columnsConfig[column.field].hidden;
				}
				if ('get' in this._columnsConfig[column.field]) {
					column.get = this._columnsConfig[column.field].get;
				}
			}
			return column;
		},

		startup: function () {
			this.inherited(arguments);
			this._subscribeToEventBus();
		},
		/**
		 * Adapt to use new event bus
		 * @private
		 */
		_subscribeToEventBus: function () {
			const grid = this,
				handlersConfig = [
					{
						eventName: 'setQuery',
						handler: function (event) {
							grid.setQuery(event.query);
						}
					},
					{
						eventName: 'getQuery',
						handler: function () {
							grid.emit('gridQuery', {query: this.getQuery()});
						}
					},
					{
						eventName: 'appendQuery',
						handler: function (event) {
							grid.appendQuery(event.query);
						}
					},
					{
						eventName: 'loadGridContent',
						handler: function () {
							grid.loadContent();
						}
					},
					{
						eventName: 'loadGridContentForQuery',
						handler: function (event) {
							let nodeKey = Math.random();
							grid._rqlBuilder.addToCache(nodeKey, event.query);
							grid.appendQuery(event.query);
							grid.setFilterBlock(event.label, nodeKey);
							grid.loadContent();
						}
					},
					{
						eventName: 'getGridTotalCount',
						handler: function () {
							grid.emit('gridTotalCount', {totalCount: grid._totalCount});
						}
					},
					{
						eventName: 'getGridColumns',
						handler: function () {
							grid.emit('gridColumns', {columns: Object.assign([], grid.columns)});
						}
					},
				];
			this.handleEvents(handlersConfig);
		},

		_cleanupContent: function () {
			if (this.noDataNode) {
				domConstruct.destroy(this.noDataNode);
				delete this.noDataNode;
			}
			else {
				this.cleanup();
			}
			delete this._lastCollection;
			this.contentNode.innerHTML = '';
		},

		/**
		 * @param query {object} - rollun-rql query object
		 */
		setQuery: function (query) {
			this._rqlBuilder.setQuery(query);
		},

		/**
		 * @returns {object} - rollun-rql query object
		 */
		getQuery: function () {
			this._rqlBuilder.getQuery();
		},

		/**
		 * @param query {object} - rollun-rql query object
		 */
		appendQuery: function (query) {
			this._rqlBuilder.appendQuery(query);
		},

		/**
		 * Get needed data from event bus
		 */
		reconfigure: function () {
			this.loadContent();
		},
	});
});