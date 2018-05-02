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
    return declare('FilterGrid', [
            Grid,
            ColumnHider,
            ColumnResizer,
            ColumnReorder,
            Keyboard,
            Selection],
        {
            collection: null,
            _filter: null,
            _paginationLimits: {limit: 20, offset: 0},
            totalCount: null,
            _configStore: null,

            /**
             * @param params {object} - must contain following:
             *        collection {object} - QueryableStore that will provide data for a grid
             *        filterBarNode {object} - DOM node that will contain filter display buttons
             */
            constructor: function (params) {
                this.inherited(arguments);
                if (typeof params.collection === 'object') {
                    this.collection = params.collection;
                } else throw new TypeError('Store passed to constructor is missing or is not an object');
                if (typeof params._configStore === 'object') {
                    this._configStore = params.configStore;
                }
            },

            /**
             * @param filter {Query} - rollun-rql query
             * @param label {string} - label that will be set
             */
            setFilter: function (filter, label = '') {
                this._filter = filter;
                this._setFilterBlock(label);
            },

            _setFilterBlock: function (label) {
                var grid = this,
                    filterNode = domConstructor.create('button', {'class': "btn btn-warning filter_active"});
                on(filterNode, "click", function () {
                        grid.clearFilter();
                        grid.filterBarNode.innerHTML = "";
                        on.emit(self.filterBarNode, "filterRemovedFromGrid", {bubbles: true});
                    }
                );
                domConstructor.place("<span class='glyphicon glyphicon-remove' style='float:right;'></span><p>" + 'Убрать ' + label + "</p>", filterNode);
                this.filterBarNode.innerHTML = "";
                this.filterBarNode.appendChild(filterNode);
            },

            clearFilter: function () {
                this._filter = null;
                this.loadContent()
            },

            /**
             * @param limit {integer}
             * @param offset {integer}
             */
            setPagination: function (limit, offset) {
                this._paginationLimits = {limit: limit, offset: offset}
            },

            /**
             * Reload the contents according to filter and pagination
             */
            loadContent: function () {
                var grid = this,
                    completeQuery = this._buildQuery(),
                    response = this.collection.query(completeQuery);
                this._cleanupContent();
                return response.then(function (response) {
                    grid._renderResponseData(response);
                    on.emit(grid.domNode, 'reloadedContent', {bubbles: true})
                }, function (error) {
                    throw error;
                })
            },

            _buildQuery: function () {//TODO: сделать функцию покрасивее
                var filter = this._filter,
                    finalQuery;
                if (!filter) {
                    filter = new Query.Query();
                }
                if (filter.args.length < 1) {
                    finalQuery = new Query.Query({
                        name: 'limit',
                        args: [this._paginationLimits.limit, this._paginationLimits.offset]
                    })
                } else {
                    var filterLimitNode = this._getLimitFromFilter(filter);
                    if (filterLimitNode) {
                        var finalLimit = this._composeFinalLimit(filterLimitNode);
                        finalQuery = new Query.Query({
                            name: 'and',
                            args: [this._filter, new Query.Query({
                                name: 'limit',
                                args: [finalLimit.limit, finalLimit.offset]
                            })]
                        })
                    } else {
                        finalQuery = new Query.Query({
                            name: 'and',
                            args: [this._filter, new Query.Query({
                                name: 'limit',
                                args: [this._paginationLimits.limit, this._paginationLimits.offset]
                            })]
                        })
                    }
                }
                return finalQuery;
            },

            /**
             * @param filter {object} - rollun-rql Query object
             * @returns {*}
             * @private
             */
            _getLimitFromFilter: function (filter) {
                for (var node in filter.args) {
                    if (node.name === 'limit') {
                        return node;
                    }
                }
            },
            /**
             * @param limitNode {object} - rollun-rql Query object
             * @returns {{limit: integer, offset: integer}}
             * @private
             */
            _composeFinalLimit: function (limitNode) {
                return {
                    limit: Math.min(limitNode.args[0], this._paginationLimits.limit),
                    offset: parseInt(limitNode.args[1] + this._paginationLimits.offset)
                }
            },
            /**
             * @param response {array}
             * @private
             */
            _renderResponseData: function (response) {
                var grid = this,
                    columns;
                if (this._configStore) {
                    columns = this._configStore.get('gridColumnDefinitions')
                } else {
                    columns = this._getColumnsFromResponse(response)
                }
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
                var grid = this;
                var deferred = new Deferred();
                on.once(grid.domNode, 'reloadedContent', function () {
                    deferred.resolve(grid.get(propertyName))
                });
                return deferred.promise;
            },

            _cleanupContent: function () {
                if (this.noDataNode) {
                    domConstruct.destroy(grid.noDataNode);
                    delete this.noDataNode;
                }
                else {
                    this.cleanup();
                }
                delete this._lastCollection;
                this.contentNode.innerHTML = '';
            }
        })
});