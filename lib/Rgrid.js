define([
    'dojo/_base/declare',
    'dgrid/Grid',
    'rql/query',
    'dgrid/extensions/ColumnHider',
    'dgrid/extensions/ColumnResizer',
    'dgrid/extensions/ColumnReorder',
    'dgrid/Keyboard',
    'dgrid/Selection',
    'dojo/on',
    'dojo/Deferred',
    'dojo/dom-construct',
    'dojo/when'
], function (declare,
             Grid,
             Query,
             ColumnHider,
             ColumnResizer,
             ColumnReorder,
             Keyboard,
             Selection,
             on,
             Deferred,
             domConstructor,
             when) {
    return declare('RGrid', [
            Grid,
            ColumnHider,
            ColumnResizer,
            ColumnReorder,
            Keyboard,
            Selection],
        {
            collection: null,
            _query: null,
            _totalCount: null,
            eventBus: null,
            _columnNames: null,
            class: 'dgrid-autoheight',

            /**
             * @param params {object} - must contain following:
             *          collection {object} - QueryableStore that will provide data for a grid
             *          filterBarNode {object} - DOM node that will contain filter display buttons
             */
            constructor: function (params) {
                this.inherited(arguments);
                if (typeof params.collection === 'object') {
                    this.collection = params.collection;
                } else {
                    throw new TypeError('Store passed to constructor is missing or is not an object');
                }
                if (typeof params.eventBus === 'object') {
                    this.eventBus = params.eventBus;

                }
                if (typeof params.query === 'object') {
                    this._query = params.query;

                }
            },

            /**
             * @param filter {Query} - rollun-rql query
             * @param label {string} - label that will be set
             */
            setFilter: function (filter, label) {
                label = label || '';
                this._query = filter;
                this._setFilterBlock(label);
            },

            _setFilterBlock: function (label) {
                const grid = this,
                    filterNode = domConstructor.create('button', {'class': "btn btn-warning filter_active"});
                on(filterNode, "click", function () {
                        grid.clearFilter();
                        grid.filterBarNode.innerHTML = "";
                        on.emit(grid.filterBarNode, "filterRemovedFromGrid", {bubbles: true});
                    }
                );
                domConstructor.place("<span class='glyphicon glyphicon-remove' style='float:right;'></span><p>" + 'Убрать ' + label + "</p>", filterNode);
                grid.filterBarNode.innerHTML = "";
                grid.filterBarNode.appendChild(filterNode);
            },

            clearFilter: function () {
                this._query = null;
                this.loadContent();
            },

            /**
             * Reload the contents according to filter and pagination
             */
            loadContent: function () {
                const grid = this,
                    response = this.collection.query(this.getQuery());
                this._cleanupContent();
                return response.then(function (response) {
                    grid._renderResponseData(response);
                    grid.eventBus.emit('gridReloadedContent', {columns:Object.assign({}, this.columns), totalCount: grid._totalCount});
                }, function (error) {
                    throw new Error(error.message);
                });
            },

            /**
             * @param response {array}
             * @private
             */
            _renderResponseData: function (response) {
                const grid = this,
                    columns = this._getColumnsFromResponse(response);
                    grid.set('columns', columns);
                this.renderArray(response);
                this._totalCount = this.collection._totalCount;
            },

            /**
             * @param itemData {array}
             * @returns {array}
             * @private
             */
            _getColumnsFromResponse: function (itemData) {
                const columns = [],
                    responseItem = itemData[0];
                for (let column in responseItem) {
                    if (responseItem.hasOwnProperty(column)) {
                        columns.push({label: column, field: column});
                    }
                }
                return columns;
            },

            startup: function () {
                this.inherited(arguments);
                this._subscribeToEventBus();
                this.loadContent();
            },

            _subscribeToEventBus: function () {
                const grid = this;
                on(this.eventBus, 'setQuery', function (event) {
                    grid.setQuery(event.query);
                });
                on(this.eventBus, 'getQuery', function () {
                    grid.eventBus.emit(this.getQuery());
                });
                on(this.eventBus, 'addNodeToQuery', function (event) {
                    grid.addNodeToQuery(event.query);
                });
                on(this.eventBus, 'loadGridContent', function () {
                    grid.loadContent();
                });
                on(this.eventBus, 'loadGridContentForQuery', function (event) {
                    grid.setQuery(event.query);
                    grid.loadContent();
                });
                on(this.eventBus, 'getGridTotalCount', function () {
                    grid.eventBus.emit('gridTotalCount', {totalCount: grid._totalCount});
                });
                on(this.eventBus, 'getGridColumns', function () {
                    grid.eventBus.emit('gridColumns', {columns: Object.assign({}, grid.columns)});
                });
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

            setQuery: function (query) {
                this._query = Object.assign({}, query);
            },

            getQuery: function () {
                return Object.assign(new Query.Query(), this._query);
            },

            addNodeToQuery: function (query) {
                if (this._isConditionNode(query)) {
                    this._addConditionToQuery(query);
                } else {
                    this._addNotConditionToQuery(query);
                }
            },

            _isConditionNode: function (query) {
                return !(query.name === 'select' || query.name === 'sort' || query.name === 'limit');
            },

            _addConditionToQuery: function (query) {
                const currentQuery = this.getQuery(),
                    currentQueryArgs = currentQuery.args,
                    newQueryArgs = [],
                    self = this;
                for (const arg of currentQueryArgs) {
                    if (!self._isConditionNode(arg)) {
                        newQueryArgs.push(arg);
                    }
                }
                newQueryArgs.push(query);
                currentQuery.args = newQueryArgs;
                self.setQuery(currentQuery);
            },

            _addNotConditionToQuery: function (query) {
                const currentQuery = this.getQuery(),
                    currentQueryArgs = currentQuery.args;
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
            }
        });
});