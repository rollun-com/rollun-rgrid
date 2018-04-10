define([
    'dojo/_base/declare',
    'dgrid/Grid',
    'dgrid/_StoreMixin',
    'rql/query',
    'dgrid/extensions/ColumnHider',
    'dgrid/extensions/ColumnResizer',
    'dgrid/extensions/ColumnReorder',
    'dgrid/Keyboard',
    'dgrid/Selection',
], function (declare,
             Grid,
             _StoreMixin,
             Query,
             ColumnHider,
             ColumnResizer,
             Keyboard,
             Selection) {
    return declare('Rgrid', [Grid, _StoreMixin, ColumnHider, ColumnResizer, Keyboard, Selection], {
        _store: null,
        _filter: new Query.Query(),
        _paginationLimits: {limit: 50, offset: 0},

        /**
         * @param store {object} - QueryableStore that will provide data for a grid
         */
        constructor: function (store) {
            this.inherited(arguments);
            if (typeof store === 'object') {
                this._store = store;
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
        refresh: function () {
            var newData = this._store.query(this._buildQuery());
            this.set('collection', newData);
            this.emit('rgridRefresh');
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
        }
    })
});