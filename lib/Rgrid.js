define([
	'dojo/_base/declare',
	'dgrid/Grid',
	'rql/query',
	'dgrid/extensions/ColumnHider',
	'dgrid/extensions/ColumnResizer',
	'dgrid/extensions/ColumnReorder',
	'dgrid/Keyboard',
	'dgrid/Selection',
	'dojo/dom-construct',
	'rgrid/mixins/_EventDriven',
	'dojo/on',
	'dijit/Dialog'
], function (declare,
			 Grid,
			 Query,
			 ColumnHider,
			 ColumnResizer,
			 ColumnReorder,
			 Keyboard,
			 Selection,
			 domConstructor,
			 _EventDriven,
			 on,
			 Dialog) {
	return declare('Rgrid', [
		Grid,
		ColumnHider,
		ColumnResizer,
		ColumnReorder,
		Keyboard,
		Selection,
		_EventDriven
	], {
		collection: null,
		_query: null,
		_totalCount: null,
		class: 'dgrid-autoheight',
		_nodeCache: {},
		_errorDialog: null,

		/**
		 * @param params {{collection: object, query?: object, filterBarNode?: object}} -
		 *          collection - QueryableStore that will provide data for a grid
		 *          query - rollun-rql Query object,
		 *          filterBarNode - DOM node that will contain filter display buttons
		 */
		constructor: function (params) {
			this.inherited(arguments);
			if (typeof params.collection === 'object') {
				this.collection = params.collection;
			} else {
				throw new TypeError('Store passed to constructor is missing or is not an object');
			}
			if (typeof params.eventBus === 'object') {
				this.setEventBus(params.eventBus);
			}
			if (typeof params.query === 'object') {
				this._query = params.query;
			} else {
				this._query = new Query.Query({
					name: "limit",
					args: [15]
				});
			}
			if (typeof params.filterBlockNode === 'object') {
				this._filterBlockNode = params.filterBlockNode;
			}
			this._nodeCache[Math.random()] = this._query;
		},

		buildRendering: function () {
			this.inherited(arguments);
			if (!this._filterBlockNode) {
				this._filterBlockNode = domConstructor.create('div', null, this.headerNode, 'before');
			}
		},

		postCreate: function () {
			this.inherited(arguments);
			this._handleColumnChanges();
			this._handleStoreErrors();
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
			});
			on(this.domNode, 'dgrid-columnstatechange', (event) => {
				let args = [];
				for (const column of this._columns) {
					if (!column.hidden) {
						args.push(column.field);
					}
				}
				const selectNode = new Query.Query({
					name: 'select',
					args: args
				});
				this.appendQuery(selectNode);
			});
		},

		_handleStoreErrors: function () {
			on(this.collection, 'failedQuery', (event) => {
				const errorMessage = `<div class="alert alert-danger">Запрос к серверу не удался. Причина:\n ${event.message}</div>`;
				if (!this._errorDialog) {
					this._createErrorDialog();
				}
				this._errorDialog.set('content', errorMessage);
				this._errorDialog.show();
				console.log(event.response);
			});
			on(this.collection, 'missingTotalCount', (event) => {
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

		/**
		 * @param label {string} - text that will be displayed on the filter block
		 * @param nodeKey {number}
		 */
		setFilterBlock: function (label, nodeKey) {
			label = label || 'Фильтр';
			const grid = this,
				filterNode = domConstructor.create('button', {'class': "btn btn-warning filter_active"});
			on(filterNode, "click", function () {
					delete grid._nodeCache[nodeKey];
					domConstructor.destroy(filterNode);
					grid.emit("filterRemovedFromGrid");
					grid._buildQueryFromCache();
					grid.loadContent();
				}
			);
			domConstructor.place("<div class='glyphicon glyphicon-remove' style='float:right;'></div><p>" + 'Убрать ' + label + "</p>", filterNode);
			grid._filterBlockNode.appendChild(filterNode);
		},

		_buildQueryFromCache: function () {
			this.setQuery(new Query.Query());
			for (let nodeKey in this._nodeCache) {
				if (this._nodeCache.hasOwnProperty(nodeKey)) {
					this.appendQuery(this._nodeCache[nodeKey]);
				}
			}
		},

		loadContent: function () {
			const grid = this,
				response = this.collection.query(this.getQuery());
			this._cleanupContent();
			return response.then(function (response) {
				grid._renderResponseData(response);
				grid.emit('gridLoadedContent', {
					columns: Object.assign({}, this.columns),
					totalCount: grid._totalCount
				});
			}, function (error) {
				throw new Error(error.message);
			});
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
		 * @param itemData {array}
		 * @returns {array} - dgrid column definition objects
		 * @private
		 */
		_getColumnsFromResponse: function (itemData) {
			const columns = [],
				responseItem = itemData[0];
			for (let column in responseItem) {
				if (responseItem.hasOwnProperty(column)) {
					columns.push({
						label: column,
						field: column
					});
				}
			}
			return columns;
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
							grid._nodeCache[nodeKey] = event.query;
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
				domConstructor.destroy(this.noDataNode);
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
			this._query = Object.assign(new Query.Query(), query);
		},

		/**
		 * @returns {object} - rollun-rql query object
		 */
		getQuery: function () {
			return Object.assign(new Query.Query(), this._query);
		},

		/**
		 * @param query {object} - rollun-rql query object
		 */
		appendQuery: function (query) {
			if (this._isConditionNode(query)) {
				this._addConditionToQuery(query);
			} else {
				this._addNotConditionToQuery(query); //select, sort, limit nodes
			}
		},

		/**
		 * @param query {object} - rollun-rql query object
		 */
		_isConditionNode: function (query) {
			return !(query.name === 'select' || query.name === 'sort' || query.name === 'limit');
		},

		/**
		 * @param query {object} - rollun-rql query object
		 */
		_addConditionToQuery: function (query) {
			const currentQuery = this.getQuery();
			if (this._isUnionNode(currentQuery)) {
				currentQuery.args.push(query);
				this.setQuery(currentQuery);
			} else {
				this.setQuery(new Query.Query({
					name: 'and',
					args: [currentQuery, query]
				}));
			}
		},

		/**
		 * @param query {object} - rollun-rql query object
		 */
		_addNotConditionToQuery: function (query) {
			const currentQuery = this.getQuery(),
				currentQueryArgs = currentQuery.args;
			if (this._isUnionNode(currentQuery)) {
				let didFindNode = false;
				currentQueryArgs.forEach(function (arg, index) {
					if (arg.name === query.name) {
						currentQuery.args[index] = query;
						didFindNode = true;
					}
				});
				if (!didFindNode) {
					currentQuery.args.push(query);
				}
				this.setQuery(currentQuery);
			} else if (currentQuery.name === query.name) {
				this.setQuery(query);
			} else {
				this.setQuery(new Query.Query({
					name: 'and',
					args: [currentQuery, query]
				}));
			}
		},
		_isUnionNode: function (node) {
			return (node.name === 'and' || node.name === 'or');
		},

		/**
		 * Get needed data from event bus
		 */
		reconfigure: function () {
			this.loadContent();
		},
	});
});