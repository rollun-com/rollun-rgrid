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
], function (declare,
             Grid,
             Query,
             ColumnHider,
             ColumnResizer,
             ColumnReorder,
             Keyboard,
             Selection,
             on) {

    return declare('FilterGrid', [Grid, ColumnHider, ColumnResizer, ColumnReorder, Keyboard, Selection], {
        collection: null,
        _filter: new Query.Query(),
        _paginationLimits: {limit: 20, offset: 0},

        /**
         * @param params {object} - must contain following:
         *        collection {object} - QueryableStore that will provide data for a grid
         */
        constructor: function (params) {
            this.inherited(arguments);
            if (typeof params.collection === 'object') {
                this.collection = params.collection;
            } else throw new TypeError('Store passed to constructor is not an object')
        },

        /**
         * @param filter {Query}
         */
        setFilter: function (filter) {
            this._filter = filter;
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
            var grid = this;
            var completeQuery = this._buildQuery();
            var response = this.collection.query(completeQuery);
            return response.then(function (response) {
                grid.set('columns', grid._getColumnsFromResponse(response));
                grid.renderArray(response);
                on.emit(grid.domNode,'reloadedContent',{bubbles: true})
            }, function (error) {
                throw error;
            })
        },

        /**
         * Build request query from filter and pagination limit
         * @private
         */
        _buildQuery: function () {
            var filterLimitNode = this._getLimitFromFilter(this._filter);
            if (filterLimitNode) {
                var finalLimit = this._composeFinalLimit(filterLimitNode);
                return this._filter.limit(finalLimit.limit, finalLimit.offset);
            } else {
                return this._filter.limit(this._paginationLimits.limit, this._paginationLimits.offset);
            }
        },

        /**
         * @param filter {object) - rollun-rql Query object
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

        _composeFinalLimit: function (limitNode) {
            var finalLimit = Math.min(limitNode.args[0], this._paginationLimits.limit),
                finalOffset = limitNode.args[1] + this._paginationLimits.offset;
            return {
                limit: finalLimit,
                offset: finalOffset
            }
        },

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

        getTotalCount: function () {
            return this.collection.totalCount;
        },

        cleanupContent: function () {
            // Remove any currently-rendered rows, or noDataMessage
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