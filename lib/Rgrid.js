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
            totalCount: null,

            /**
             * @param params {object} - must contain following:
             *        collection {object} - QueryableStore that will provide data for a grid
             *        filterBarNode {object} - DOM node that will contain filter display buttons
             */
            constructor: function (params) {
                this.inherited(arguments);
                if (typeof params.collection === 'object') {
                    this.collection = params.collection;
                } else {
                    throw new TypeError('Store passed to constructor is missing or is not an object');
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
                var grid = this,
                    filterNode = domConstructor.create('button', {'class': "btn btn-warning filter_active"});
                on(filterNode, "click", function () {
                        grid.clearFilter();
                        grid.filterBarNode.innerHTML = "";
                        on.emit(grid.filterBarNode, "filterRemovedFromGrid", {bubbles: true});
                    }
                );
                domConstructor.place("<span class='glyphicon glyphicon-remove' style='float:right;'></span><p>" + 'Убрать ' + label + "</p>", filterNode);
                this.filterBarNode.innerHTML = "";
                this.filterBarNode.appendChild(filterNode);
            },

            clearFilter: function () {
                this._query = null;
                this.loadContent();
            },

            /**
             * Reload the contents according to filter and pagination
             */
            loadContent: function () {
                var grid = this,
                    response = this.collection.query(this.getQuery());
                this._cleanupContent();
                return response.then(function (response) {
                    grid._renderResponseData(response);
                    on.emit(grid.domNode, 'reloadedContent', {bubbles: true});
                }, function (error) {
                    throw error;
                });
            },

            /**
             * @param response {array}
             * @private
             */
            _renderResponseData: function (response) {
                var grid = this,
                    columns = this._getColumnsFromResponse(response);
                when(columns, function (columns) {
                    grid.set('columns', columns);
                });
                this.renderArray(response);
                this.totalCount = this.collection.totalCount;
            },

            /**
             * @param itemData {array}
             * @returns {array}
             * @private
             */
            _getColumnsFromResponse: function (itemData) {
                var columns = [];
                var respObj = itemData[0];
                for (var column in respObj) {
                    if (respObj.hasOwnProperty(column)) {
                        columns.push({label: column, field: column});
                    }
                }
                return columns;
            },

            startup: function () {
                this.inherited(arguments);
                this.loadContent();
            },
            /**
             * @param propertyName {string}
             * @returns {*}
             */
            get: function (propertyName) {
                if (this.inherited(arguments)) {
                    return this.inherited(arguments);
                } else {
                    return this._deferredGet(propertyName);
                }
            },

            /**
             * @param propertyName {string}
             * @returns {object} - promise that will resolve with needed property
             */
            _deferredGet: function (propertyName) {
                var grid = this,
                    deferred = new Deferred();
                on.once(grid.domNode, 'reloadedContent', function () {
                    deferred.resolve(grid.get(propertyName));
                });
                return deferred.promise;
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
                return Object.assign({}, this._query);
            },

            addNodeToQuery: function (query) {
                if (this._isConditionNode(query)) {
                    this._addConditionToQuery(query);
                } else {
                    this._addNotConditionToQuery(query);
                }
            },

            _isConditionNode: function (query) {
                var queryName = query.name;
                return !(queryName === 'select' || queryName === 'sort' || queryName === 'limit');
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