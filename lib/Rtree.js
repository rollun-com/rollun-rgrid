define([
	'dojo/_base/declare',
	'dijit/Tree',
	'rgrid/mixins/_EventDriven',
	'rgrid/mixins/_QueryCapable',
	'dijit/_WidgetBase',
	'dstore/Memory',
	'dojo/dom-construct',
	'dojo/on',
	'dijit/Dialog',
	'dojo/dom-style'
], (declare,
	Tree,
	_EventDriven,
	_QueryCapable,
	_WidgetBase,
	Memory,
	domConstruct,
	on,
	Dialog,
	domStyle) => {
	return declare('Rtree', [_WidgetBase, _EventDriven, _QueryCapable], {
		_datastore: null,
		_tree: null,
		_treeDomNode: null,
		_treeDomNodeClass: 'rgrid-tree',
		_filterBlockNode: null,
		_modelConfig: null,

		constructor: function (params) {
			if (typeof params.store === 'object') {
				this._datastore = params.store;
			} else {
				throw new Error('params.store isn`t set or isn`t an object');
			}
			if (typeof params.modelConfig === 'object') {
				this._modelConfig = params.modelConfig;
			} else {
				throw new Error('params.modelConfig isn`t set or isn`t an object');
			}
			if (typeof params.domNode === 'object') {
				this.domNode = params.domNode;
			}
			if (typeof params.filterBlockNode === 'object') {
				this._filterBlockNode = params.filterBlockNode;
			}
		},

		buildRendering: function () {
			this._treeDomNode = domConstruct.place(`<div class="${this._treeDomNodeClass}"></div>`, this.domNode);
			if (!this._filterBlockNode) {
				this._filterBlockNode = domConstruct.create('div', null, this._treeDomNode, 'before');
			}
			domStyle.set(this.domNode, 'min-height', '10em');

		},

		updateTree: function () {
			const response = this._datastore.query(this.getQuery());
			response.then((responseData) => {
				const processedResponseData = this._processResponseData(responseData),
					modelFromResponseData = new Memory({
						data: processedResponseData,
						getChildren: this._modelConfig.getChildren,
						mayHaveChildren: this._modelConfig.mayHaveChildren,
						getRoot: this._modelConfig.getRoot,
						getLabel: this._modelConfig.getLabel,
					});
				this._renderTreeWithModel(modelFromResponseData);
				this.emit('gridLoadedContent', {
					columns: Object.assign({}, this._getColumnsFromResponse(responseData)),
					totalCount: this._datastore.totalCount
				});
			});
		},

		_processResponseData: function (responseData) {
			return responseData;
		},

		_renderTreeWithModel: function (model) {
			while (this._treeDomNode.firstChild) {
				this._treeDomNode.removeChild(this._treeDomNode.firstChild);
			}
			this._tree = new Tree({
				model: model,
			});
			this._tree.placeAt(this._treeDomNode);
			this._tree.startup();
		},

		_getColumnsFromResponse: function (response) {
			const finalColumns = [];
			for (const fieldName in response[0]) {
				if (response[0].hasOwnProperty(fieldName)) {
					finalColumns.push({
						label: fieldName,
						field: fieldName,
						hidden: false
					});
				}
			}
			return finalColumns;
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
					this.removeFromCache(nodeKey);
					domConstruct.destroy(filterNode);
					this.emit("filterRemovedFromGrid");
					this.buildQueryFromCache();
					this.loadContent();
				}
			);
			domConstruct.place("<div class='glyphicon glyphicon-remove' style='float:right;'></div><p>" + 'Убрать ' + label + "</p>", filterNode);
			return filterNode;
		},

		/**
		 * Adapt to use new event bus
		 * @private
		 */
		_subscribeToEventBus: function () {
			const tree = this,
				handlersConfig = [
					{
						eventName: 'setQuery',
						handler: function (event) {
							tree.setQuery(event.query);
						}
					},
					{
						eventName: 'getQuery',
						handler: function () {
							tree.emit('gridQuery', {query: this.getQuery()});
						}
					},
					{
						eventName: 'appendQuery',
						handler: function (event) {
							tree.appendQuery(event.query);
						}
					},
					{
						eventName: 'loadGridContent',
						handler: function () {
							tree.updateTree();
						}
					},
					{
						eventName: 'loadGridContentForQuery',
						handler: function (event) {
							let nodeKey = Math.random();
							tree.addToCache(nodeKey, event.query);
							tree.appendQuery(event.query);
							tree.setFilterBlock(event.label, nodeKey);
							tree.updateTree();
						}
					},
					{
						eventName: 'getGridTotalCount',
						handler: function () {
							tree.emit('gridTotalCount', {totalCount: tree._totalCount});
						}
					},
					{
						eventName: 'getGridColumns',
						handler: function () {
							tree.emit('gridColumns', {columns: Object.assign([], tree.columns)});
						}
					},
				];
			this.handleEvents(handlersConfig);
		},

		reconfigure: function () {
			this.updateTree();
		}
	});
});